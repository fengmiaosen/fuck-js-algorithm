// 判断纯对象
// 一般是key/value形式的对象 还是要根据实际情况来确定判断方式 主要是对Object.create以及new Any Class形式的判断

function isPlainObject(obj){

    if(typeof obj !== 'object' || !obj){
        return false;
    }

    let proto = obj;

    // Object.getPrototypeOf 返回指定对象的原型（内部[[Prototype]]属性的值）
    while(Object.getPrototypeOf(proto) !== null){
        proto = Object.getPrototypeOf(proto);
    }

    return Object.getPrototypeOf(obj) === proto;
}

function A() {}

console.log(isPlainObject( new A ));      // false
console.log(isPlainObject( new Object )); // true
console.log(isPlainObject( {} ));         // true
