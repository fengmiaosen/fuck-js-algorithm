// 参照 
// https://juejin.im/post/5b0b9b9051882515773ae714
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof

/**
 * 模拟实现 instanceOf
 * 其实 instanceof 主要的实现原理就是只要右边变量的 prototype 在左边变量的原型链上（__proto__）即可。
 * 因此，instanceof 在查找的过程中会遍历左边变量的原型链，直到找到右边变量的 prototype，如果查找失败，则会返回 false，告诉我们左边变量并非是右边变量的实例
 * @param {*} obj 
 * @param {*} R 
 */
function instance_of(obj, R) {
    //L 表示左表达式，R 表示右表达式

    // L = L.__proto__
    obj = Object.getPrototypeOf(obj)

    while (obj) {

        if (obj === R.prototype) {
            return true;
        }

        // L = L.__proto__
        obj = Object.getPrototypeOf(obj)
    }

    return false;
}

function C() { }
function D() { }

var o = new C();

var myDate = new Date();

var myNonObj  = Object.create(null);


console.log(instance_of(o, Object));

console.log(instance_of(myDate, Object));

console.log(instance_of(myNonObj, Object));