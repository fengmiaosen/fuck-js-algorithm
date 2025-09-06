function cloneObj(obj, map = new WeakMap()) {

    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (map.has(obj)) {
        return map.get(obj);
    }

    // 处理数组和普通对象
    const newObj = Array.isArray(obj) ? [] : {};
    map.set(obj, newObj);
    const keys = Object.keys(obj);
    for(let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = obj[key];
        newObj[key] = cloneObj(value, map)
    }

    // 处理特殊类型
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }

    if (obj instanceof RegExp) {
        return new RegExp(obj.source, obj.flags);
    }
    
    if(obj instanceof Map) {
        const newMap = new Map();
        map.set(obj, newMap);
        for(const [key, value] of obj) {
            newMap.set(cloneObj(key, map), cloneObj(value, map));
        }
        return newMap;
    }

    if(obj instanceof Set) {
        const newSet = new Set();
        map.set(obj, newSet);
        for(const value of obj) {
            newSet.add(cloneObj(value, map));
        }
        return newSet;
    }

    // symbole属性处理
    const symbols = Object.getOwnPropertySymbols(obj);
    for(let i=0;i<symbols.length;i++) {
        const symbol = symbols[i];
        const value = obj[symbol];
        newObj[symbol] = cloneObj(value, map);
    }

    return newObj;
}

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

    // // 循环引用测试
    // const circularObj = { name: 'circular' };
    // circularObj.self = circularObj;

    // 特殊类型测试
    const specialObj = {
        date: new Date(),
        regex: /test/g,
        map: new Map([['key1', 'value1'], ['key2', 'value2']]),
        set: new Set([1, 2, 3]),
        null: null,
        undefined: undefined,
        number: 42,
        string: 'hello',
        boolean: true
    };

console.log('原始对象:', JSON.stringify(obj, null, 2));
const cloned = cloneObj(obj);
console.log('克隆对象:', JSON.stringify(cloned, null, 2));
console.log('是否相等:', obj === cloned);
console.log('内容是否相等:', JSON.stringify(obj) === JSON.stringify(cloned));

const cloned2 = cloneObj(specialObj);
console.log('克隆对象222:', JSON.stringify(cloned2, null, 2));