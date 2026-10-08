// 深度优先遍历 DFS - 完整优化版本

/**
 * 深度优先遍历实现深拷贝
 * @param {any} obj - 要拷贝的对象
 * @param {WeakMap} map - 用于处理循环引用的WeakMap
 * @returns {any} - 拷贝后的对象
 */
function cloneObj(obj, map = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (map.has(obj)) {
        return map.get(obj);
    }

    const prototype = Object.getPrototypeOf(obj);
    const Ctor = obj.constructor;

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

    if (ArrayBuffer.isView(obj)) {
        return new Ctor(obj.buffer.slice(), obj.byteOffset, obj.length);
    }

    if (obj instanceof ArrayBuffer) {
        return obj.slice(0);
    }

    if (obj instanceof Error) {
        const error = new Ctor(obj.message);
        error.name = obj.name;
        error.stack = obj.stack;
        return error;
    }

    const target = Array.isArray(obj) ? [] : Object.create(prototype);
    map.set(obj, target);

    const keys = Reflect.ownKeys(obj);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const descriptor = Object.getOwnPropertyDescriptor(obj, key);
        if (descriptor.value !== undefined) {
            const value = descriptor.value;
            target[key] = (value !== null && typeof value === 'object') ? cloneObj(value, map) : value;
        } else if (descriptor.get || descriptor.set) {
            Object.defineProperty(target, key, descriptor);
        }
    }

    return target;
}

// 测试用例
function testCloneObj() {
    console.log('=== DFS 深拷贝测试 ===');

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

    console.log('原始对象:', JSON.stringify(obj, null, 2));
    const cloned = cloneObj(obj);
    console.log('克隆对象:', JSON.stringify(cloned, null, 2));
    console.log('是否相等:', obj === cloned);
    console.log('内容是否相等:', JSON.stringify(obj) === JSON.stringify(cloned));

    console.log('\n=== 循环引用测试 ===');
    const circularObj = { name: 'circular' };
    circularObj.self = circularObj;
    const clonedCircular = cloneObj(circularObj);
    console.log('循环引用处理:', clonedCircular.self === clonedCircular);

    console.log('\n=== 特殊对象测试 ===');
    const specialObj = {
        date: new Date('2024-01-01'),
        regex: /test/gi,
        map: new Map([['key', 'value']]),
        set: new Set([1, 2, 3]),
        typedArray: new Uint8Array([1, 2, 3]),
        arrayBuffer: new ArrayBuffer(8),
        error: new Error('test error')
    };
    specialObj.map.set('nested', { value: 123 });
    specialObj.set.add({ obj: 'test' });

    const clonedSpecial = cloneObj(specialObj);
    console.log('Date:', clonedSpecial.date instanceof Date, clonedSpecial.date.getTime() === specialObj.date.getTime());
    console.log('RegExp:', clonedSpecial.regex instanceof RegExp, clonedSpecial.regex.source === specialObj.regex.source);
    console.log('Map:', clonedSpecial.map instanceof Map, clonedSpecial.map.get('nested').value === 123);
    console.log('Set:', clonedSpecial.set instanceof Set, clonedSpecial.set.size === specialObj.set.size, `原始大小: ${specialObj.set.size}, 克隆大小: ${clonedSpecial.set.size}`);
    console.log('TypedArray:', clonedSpecial.typedArray instanceof Uint8Array, clonedSpecial.typedArray[0] === 1);
    console.log('ArrayBuffer:', clonedSpecial.arrayBuffer instanceof ArrayBuffer);
    console.log('Error:', clonedSpecial.error instanceof Error, clonedSpecial.error.message === 'test error');

    console.log('\n=== Symbol 属性测试 ===');
    const symObj = { name: 'test' };
    const sym = Symbol('desc');
    symObj[sym] = 'symbol value';
    const clonedSym = cloneObj(symObj);
    console.log('Symbol 属性:', clonedSym[sym] === 'symbol value');

    console.log('\n=== 原型链测试 ===');
    const protoObj = Object.create({ protoProp: 'protoValue' });
    protoObj.ownProp = 'ownValue';
    const clonedProto = cloneObj(protoObj);
    console.log('原型链保持:', clonedProto.protoProp === 'protoValue');

    console.log('\n=== Getter/Setter 测试 ===');
    const getterSetterObj = {
        _value: 0,
        get value() { return this._value; },
        set value(v) { this._value = v; }
    };
    const clonedGetterSetter = cloneObj(getterSetterObj);
    clonedGetterSetter.value = 10;
    console.log('Getter/Setter:', clonedGetterSetter.value === 10);

    console.log('\n=== 性能测试 ===');
    const largeObj = {};
    for (let i = 0; i < 1000; i++) {
        largeObj[`key${i}`] = { value: i, nested: { deep: i * 2 } };
    }

    const start = performance.now();
    const clonedLarge = cloneObj(largeObj);
    const end = performance.now();
    console.log(`克隆1000个嵌套对象耗时: ${(end - start).toFixed(2)}ms`);
}

testCloneObj();