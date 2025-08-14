// DFS 深拷贝 - 优化版本

/**
 * 优化的深度优先遍历深拷贝
 * 支持更多数据类型和性能优化
 */
function cloneObjOptimized(obj, map = new WeakMap()) {
    // 1. 基础类型快速返回
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // 2. 循环引用检查
    if (map.has(obj)) {
        return map.get(obj);
    }

    // 3. 特殊类型处理
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    
    if (obj instanceof RegExp) {
        return new RegExp(obj.source, obj.flags);
    }
    
    if (obj instanceof Map) {
        const newMap = new Map();
        map.set(obj, newMap);
        for (const [key, value] of obj) {
            newMap.set(cloneObjOptimized(key, map), cloneObjOptimized(value, map));
        }
        return newMap;
    }
    
    if (obj instanceof Set) {
        const newSet = new Set();
        map.set(obj, newSet);
        for (const value of obj) {
            newSet.add(cloneObjOptimized(value, map));
        }
        return newSet;
    }

    if (obj instanceof ArrayBuffer) {
        return obj.slice(0);
    }

    if (ArrayBuffer.isView(obj)) {
        return new obj.constructor(obj);
    }

    // 4. 数组和对象处理
    const target = Array.isArray(obj) ? [] : {};
    map.set(obj, target);

    // 5. 高效遍历 - 使用Object.keys避免for...in的性能问题
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = obj[key];
        
        if (value !== null && typeof value === 'object') {
            target[key] = cloneObjOptimized(value, map);
        } else {
            target[key] = value;
        }
    }

    // 6. Symbol属性处理
    const symbols = Object.getOwnPropertySymbols(obj);
    for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i];
        const value = obj[symbol];
        
        if (value !== null && typeof value === 'object') {
            target[symbol] = cloneObjOptimized(value, map);
        } else {
            target[symbol] = value;
        }
    }

    return target;
}

// 测试函数
function testOptimizedClone() {
    console.log('=== DFS 优化版本测试 ===\n');

    // 基础测试
    const obj = {
        a: {
            a_bfff_x: [1, { c: 2 }]
        },
        x_booo: 1,
        y: [{
            a_yppp: 22,
            b: null,
            c: { d: [12, 34, 67] }
        }]
    };

    // 特殊类型测试
    const specialObj = {
        date: new Date(),
        regex: /test/g,
        map: new Map([['key1', 'value1']]),
        set: new Set([1, 2, 3]),
        arrayBuffer: new ArrayBuffer(8),
        symbol: Symbol('test')
    };
    specialObj[Symbol('dynamic')] = 'symbol value';

    // 循环引用测试
    const circular = { name: 'circular' };
    circular.self = circular;

    console.log('原始对象:', JSON.stringify(obj, null, 2));
    const cloned = cloneObjOptimized(obj);
    console.log('克隆对象:', JSON.stringify(cloned, null, 2));
    console.log('引用不同:', obj !== cloned);
    console.log('内容相同:', JSON.stringify(obj) === JSON.stringify(cloned));

    // 性能测试
    const largeObj = {};
    for (let i = 0; i < 1000; i++) {
        largeObj[`key${i}`] = { value: i, nested: { deep: i * 2 } };
    }

    const start = performance.now();
    const clonedLarge = cloneObjOptimized(largeObj);
    const end = performance.now();
    console.log(`\n性能测试: 克隆1000个嵌套对象耗时 ${(end - start).toFixed(2)}ms`);
}

// 运行测试
testOptimizedClone();
