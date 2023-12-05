let a = [];

let b = {};


// a.__proto__ === Array.prototype
console.log(a.__proto__);

// Array.prototype = new Object()
// Array.prototype.__proto__ = (new Object()).__proto__
// (new Object()).__proto__ === Object.prototype
// a.__proto__.__proto__ === Object.prototype
// b.__proto__ === Object.prototype

console.log(a.__proto__.__proto__);

console.log(a.__proto__.__proto__.__proto__);

console.log(a.__proto__.__proto__  ===  b.__proto__);

console.log(a.__proto__.__proto__.__proto__  ===  b.__proto__);