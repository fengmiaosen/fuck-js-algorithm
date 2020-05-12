// 模拟实现一个深拷贝，并考虑对象相互引用以及 Symbol 拷贝的情况

function deepClone(val, map = new WeakMap()) {
    if (val === null || typeof val !== 'object') {
        return val;
    }

    //循环引用
    if (map.has(val)) {
        return map.get(val);
    }

    let clone = Array.isArray(val) ? [] : {};

    map.set(val, clone);

    // 获取对象中所有的属性名（包含Symbol值）
    //（可换为：Object.keys(val).concat(Object.ownPropertySymbols(val))）
    let keys = Reflect.ownKeys(val);
    let len = keys.length;

    while (len--) {
        clone[keys[len]] = deepClone(val[keys[len]], map);
    }

    return clone;
}