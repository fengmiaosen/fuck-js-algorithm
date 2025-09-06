// 深度优先遍历 DFS - 优化版本

/**
 * 深度优先遍历实现深拷贝
 * @param {any} obj - 要拷贝的对象
 * @param {WeakMap} map - 用于处理循环引用的WeakMap
 * @returns {any} - 拷贝后的对象
 */
function cloneObj(obj, map = new WeakMap()) {
    // 1. 基础类型直接返回
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // 2. 处理循环引用
    if (map.has(obj)) {
        return map.get(obj);
    }

    // 3. 处理特殊对象类型
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
            newMap.set(cloneObj(key, map), cloneObj(value, map));
        }
        return newMap;
    }
    
    if (obj instanceof Set) {
        const newSet = new Set();
        map.set(obj, newSet);
        for (const value of obj) {
            newSet.add(cloneObj(value, map));
        }
        return newSet;
    }

    // 4. 处理数组和普通对象
    const target = Array.isArray(obj) ? [] : {};
    map.set(obj, target);

    // 5. 使用更高效的方式遍历对象
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = obj[key];
        
        // 6. 优化：避免重复的typeof检查
        if (value !== null && typeof value === 'object') {
            target[key] = cloneObj(value, map);
        } else {
            target[key] = value;
        }
    }

    return target;
}

// 测试用例
function testCloneObj() {
    console.log('=== DFS 深拷贝测试 ===');
    
    // 基础测试
    const obj = {
        a: {
            a_bfff_x: [
                1,
                {
                    c: 2
                }
            ]
        },
        x_booo: 1,
        y: [
            {
                a_yppp: 22,
                b: null,
                c: {
                    d: [12, 34, 67]
                }
            }
        ]
    };

    // 循环引用测试
    const circularObj = { name: 'circular' };
    circularObj.self = circularObj;

    console.log('原始对象:', JSON.stringify(obj, null, 2));
    const cloned = cloneObj(obj);
    console.log('克隆对象:', JSON.stringify(cloned, null, 2));
    console.log('是否相等:', obj === cloned);
    console.log('内容是否相等:', JSON.stringify(obj) === JSON.stringify(cloned));

    // 性能测试
    const largeObj = {};
    for (let i = 0; i < 1000; i++) {
        largeObj[`key${i}`] = { value: i, nested: { deep: i * 2 } };
    }

    console.log('\n=== 性能测试 ===');
    const start = performance.now();
    const clonedLarge = cloneObj(largeObj);
    const end = performance.now();
    console.log(`克隆1000个嵌套对象耗时: ${(end - start).toFixed(2)}ms`);
}

// 运行测试
testCloneObj();