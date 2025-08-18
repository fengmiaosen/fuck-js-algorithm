// https://www.cnblogs.com/echolun/p/12178655.html
// 用constructor属性来判断当前bind生成的新 bound方法调用方式，毕竟只要是new调用，this.constructor === Fn一定为true
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor

Function.prototype.bindFn = function (context, ...args) {
    // Fixed: Add type checking for security
    if (typeof this !== 'function') {
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }
    
    let fn = this

    function bound(...params) {
        //通过constructor判断调用方式，为 true , this指向实例，否则为 context
        context = this.constructor === fn ? this : context
        // Fixed: Return the result of the function call
        return fn.apply(context, [...args, ...params])
    }

    // 为了避免bound的prototype被修改，增加一个中间空函数
    let fnProto = function () { }
    fnProto.prototype = fn.prototype
    bound.prototype = new fnProto()

    return bound
}

var z = 0;
var obj = {
    z: 1
};

function fn(x, y) {
    this.name = '听风是风';
    console.log(this.z);
    console.log(x);
    console.log(y);
};
fn.prototype.age = 26;

var bound = fn.bindFn(obj, 2);
var person = new bound(3); //undefined 2 3

console.log(person.name); //听风是风
console.log(person.age); //26
person.__proto__.age = 18;

var person = new fn();
console.log(person.age); //26