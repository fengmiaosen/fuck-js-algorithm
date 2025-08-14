// DFS 深拷贝性能对比测试

// 原始版本
function cloneObjOriginal(obj, map = new WeakMap()) {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }

    if (map.has(obj)) {
        return map.get(obj);
    }

    let target = Array.isArray(obj) ? [] : {};
    map.set(obj, target);

    for (let key in obj) {
        const newKey = key;

        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                if (!obj[key]) {
                    target[newKey] = obj[key];
                } else {
                    target[newKey] = cloneObjOriginal(obj[key], map);
                }
            } else {
                target[newKey] = obj[key];
            }
        }
    }

    return target;
}

// 优化版本
function cloneObjOptimized(obj, map = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (map.has(obj)) {
        return map.get(obj);
    }

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

    const target = Array.isArray(obj) ? [] : {};
    map.set(obj, target);

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

// 性能测试函数
function performanceTest() {
    console.log('=== DFS 深拷贝性能对比测试 ===\n');

    // 创建测试数据
    const testCases = [
        { name: '小对象 (10个属性)', size: 10 },
        { name: '中等对象 (100个属性)', size: 100 },
        { name: '大对象 (1000个属性)', size: 1000 },
        { name: '超大对象 (10000个属性)', size: 10000 }
    ];

    testCases.forEach(testCase => {
        console.log(`\n${testCase.name}:`);
        
        // 创建测试对象
        const testObj = {};
        for (let i = 0; i < testCase.size; i++) {
            testObj[`key${i}`] = {
                value: i,
                nested: { deep: i * 2, deeper: { deepest: i * 3 } },
                array: Array.from({ length: 5 }, (_, j) => j + i)
            };
        }

        // 测试原始版本
        const start1 = performance.now();
        const result1 = cloneObjOriginal(testObj);
        const end1 = performance.now();
        const time1 = end1 - start1;

        // 测试优化版本
        const start2 = performance.now();
        const result2 = cloneObjOptimized(testObj);
        const end2 = performance.now();
        const time2 = end2 - start2;

        console.log(`  原始版本: ${time1.toFixed(2)}ms`);
        console.log(`  优化版本: ${time2.toFixed(2)}ms`);
        console.log(`  性能提升: ${((time1 - time2) / time1 * 100).toFixed(1)}%`);
        console.log(`  结果正确: ${JSON.stringify(result1) === JSON.stringify(result2)}`);
    });

    // 特殊类型测试
    console.log('\n=== 特殊类型支持测试 ===');
    
    const specialObj = {
        date: new Date(),
        regex: /test/g,
        map: new Map([['key1', 'value1'], ['key2', 'value2']]),
        set: new Set([1, 2, 3, 3, 4]),
        symbol: Symbol('test')
    };
    specialObj[Symbol('dynamic')] = 'symbol value';

    console.log('原始版本特殊类型测试:');
    try {
        const result1 = cloneObjOriginal(specialObj);
        console.log('  Date:', result1.date instanceof Date);
        console.log('  RegExp:', result1.regex instanceof RegExp);
        console.log('  Map:', result1.map instanceof Map);
        console.log('  Set:', result1.set instanceof Set);
    } catch (error) {
        console.log('  错误:', error.message);
    }

    console.log('优化版本特殊类型测试:');
    try {
        const result2 = cloneObjOptimized(specialObj);
        console.log('  Date:', result2.date instanceof Date);
        console.log('  RegExp:', result2.regex instanceof RegExp);
        console.log('  Map:', result2.map instanceof Map);
        console.log('  Set:', result2.set instanceof Set);
        console.log('  Symbol:', typeof result2.symbol === 'symbol');
    } catch (error) {
        console.log('  错误:', error.message);
    }
}

// 运行测试
performanceTest();
