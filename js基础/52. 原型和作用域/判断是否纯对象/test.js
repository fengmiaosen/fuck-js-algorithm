
function isPlainObj(obj) {
    if (typeof obj !== 'object' || !obj) {
        return false
    }

    let proto = obj.__proto__
    while (proto.__proto__) {
        proto = proto.__proto__
    }

    return proto === obj.__proto__
}

function AFunction() { }

console.log('isPlainObj=====')
console.log(isPlainObj(new AFunction));      // false
console.log(isPlainObj(new Object)); // true
console.log(isPlainObj({}));         // true