/**
 * DFS 深度优先搜索实现 JavaScript 对象深拷贝
 */

function deepCloneDFS(obj, map = new WeakMap()) {
    // 1. 基础类型处理
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // 2. 循环引用检测
    if (map.has(obj)) {
        return map.get(obj);
    }

    // 3. 特殊对象类型处理
    if (obj instanceof Date) {
        const clonedDate = new Date(obj.getTime());
        map.set(obj, clonedDate);
        return clonedDate;
    }
    
    if (obj instanceof RegExp) {
        const clonedRegex = new RegExp(obj.source, obj.flags);
        map.set(obj, clonedRegex);
        return clonedRegex;
    }
    
    if (obj instanceof Map) {
        const clonedMap = new Map();
        map.set(obj, clonedMap);
        for (const [key, value] of obj) {
            clonedMap.set(
                deepCloneDFS(key, map),
                deepCloneDFS(value, map)
            );
        }
        return clonedMap;
    }
    
    if (obj instanceof Set) {
        const clonedSet = new Set();
        map.set(obj, clonedSet);
        for (const value of obj) {
            clonedSet.add(deepCloneDFS(value, map));
        }
        return clonedSet;
    }
    
    if (obj instanceof ArrayBuffer) {
        const clonedBuffer = obj.slice(0);
        map.set(obj, clonedBuffer);
        return clonedBuffer;
    }
    
    if (ArrayBuffer.isView(obj)) {
        const clonedTypedArray = new obj.constructor(obj);
        map.set(obj, clonedTypedArray);
        return clonedTypedArray;
    }

    // 4. 数组和普通对象处理
    const target = Array.isArray(obj) ? [] : {};
    map.set(obj, target);
    
    // 处理普通属性
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = obj[key];
        
        if (value !== null && typeof value === 'object') {
            target[key] = deepCloneDFS(value, map);
        } else {
            target[key] = value;
        }
    }
    
    // 处理 Symbol 属性
    const symbols = Object.getOwnPropertySymbols(obj);
    for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i];
        const value = obj[symbol];
        
        if (value !== null && typeof value === 'object') {
            target[symbol] = deepCloneDFS(value, map);
        } else {
            target[symbol] = value;
        }
    }
    
    // 保持原型链
    Object.setPrototypeOf(target, Object.getPrototypeOf(obj));
    
    return target;
}

// 测试函数
function testDeepCloneDFS() {
    console.log('=== DFS 深拷贝测试 ===\n');
    
    // 基础测试
    const obj = {
        string: 'hello',
        number: 42,
        boolean: true,
        null: null,
        array: [1, 2, 3, { nested: 'value' }],
        object: { a: 1, b: { c: 2 } }
    };
    
    const cloned = deepCloneDFS(obj);
    console.log('基础对象克隆:', obj !== cloned);
    console.log('嵌套对象不同:', obj.object !== cloned.object);
    
    // 特殊类型测试
    const specialObj = {
        date: new Date(),
        regex: /test/g,
        map: new Map([['key1', 'value1']]),
        set: new Set([1, 2, 3]),
        symbol: Symbol('test')
    };
    
    const clonedSpecial = deepCloneDFS(specialObj);
    console.log('特殊类型克隆:', 
        specialObj.date !== clonedSpecial.date &&
        specialObj.regex !== clonedSpecial.regex &&
        specialObj.map !== clonedSpecial.map &&
        specialObj.set !== clonedSpecial.set
    );
    
    // 循环引用测试
    const circular = { name: 'circular' };
    circular.self = circular;
    
    try {
        const clonedCircular = deepCloneDFS(circular);
        console.log('循环引用处理:', clonedCircular.self === clonedCircular);
    } catch (error) {
        console.log('循环引用处理失败:', error.message);
    }
    
    // 性能测试
    const largeObj = {};
    for (let i = 0; i < 1000; i++) {
        largeObj[`key${i}`] = { value: i, nested: { deep: i * 2 } };
    }
    
    const start = performance.now();
    const clonedLarge = deepCloneDFS(largeObj);
    const end = performance.now();
    
    console.log(`性能测试: 克隆1000个嵌套对象耗时 ${(end - start).toFixed(2)}ms`);
}

// 运行测试
testDeepCloneDFS();
