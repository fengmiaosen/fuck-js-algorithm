// 判断纯对象
// 一般是key/value形式的对象 
// 根据原型链递归由下到上遍历，一直到原型属性为空
// 主要是对Object.create以及new Any Class形式的判断

function isPlainObject(obj) {
    if (typeof obj !== 'object' || !obj) {
        return false;
    }

    let proto = obj;

    // Object.getPrototypeOf 返回指定对象的原型（内部[[Prototype]]属性的值）
    // 等同于 proto.__proto__
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }

    return Object.getPrototypeOf(obj) === proto;
}


function isPlainObj(obj) {
    if (typeof obj !== 'object' || !obj) {
        return false
    }

    let proto = obj

    while (proto.__proto__) {
        proto = proto.__proto__
    }

    console.log('obj.__proto__:', obj.__proto__)
    console.log('proto:', proto)

    return obj.__proto__ === proto
}


function A() { }

console.log('plain obj proto:', Object.getPrototypeOf({}))

console.log(isPlainObject(new A));      // false
console.log(isPlainObject(new Object)); // true
console.log(isPlainObject({}));         // true

console.log('isPlainObj=====')
console.log(isPlainObj(new A));      // false
console.log(isPlainObj(new Object)); // true
console.log(isPlainObj({}));         // true