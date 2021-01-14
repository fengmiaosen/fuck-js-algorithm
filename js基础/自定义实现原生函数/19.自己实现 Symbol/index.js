// 实现一个 Symbol，需要满足以下需求：
// 1、返回的值不能相同
// 2、无法作为构造函数调用，否则抛出异常
// 3、如果我们希望使用同一个 Symbol 值，可以使用 Symbol.for。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则返回一个新的 Symbol 值。ex:
// var s1 = Symbol('foo');
// var s4 = Symbol('foo');
// var s2 = Symbol.for('foo');
// var s3 = Symbol.for('foo');
// console.log(s1 === s2); // false
// console.log(s2 === s3); // true
// console.log(s1 === s4); // false

// 详细实现代码参见：
// https://juejin.im/post/5b1f4c21f265da6e0f70bb19

//  https://gist.github.com/liril-net/4436fb0bdc8f8ddecbdd34bdfa571b14

(function() {
    var root = this;

    var generateName = (function(){
        var postfix = 0;
        return function(descString){
            postfix++;
            return '@@' + descString + '_' + postfix
        }
    })()

    var SymbolPolyfill = function Symbol(description) {

        if (this instanceof SymbolPolyfill) throw new TypeError('Symbol is not a constructor');

        var descString = description === undefined ? undefined : String(description)

        var symbol = Object.create({
            toString: function() {
                return this.__Name__;
            },
            valueOf: function() {
                return this;
            }
        })

        Object.defineProperties(symbol, {
            '__Description__': {
                value: descString,
                writable: false,
                enumerable: false,
                configurable: false
            },
            '__Name__': {
                value: generateName(descString),
                writable: false,
                enumerable: false,
                configurable: false
            }
        });

        return symbol;
    }

    var forMap = {};

    Object.defineProperties(SymbolPolyfill, {
        'for': {
            value: function(description) {
                var descString = description === undefined ? undefined : String(description)
                return forMap[descString] ? forMap[descString] : forMap[descString] = SymbolPolyfill(descString);
            },
            writable: true,
            enumerable: false,
            configurable: true
        },
        'keyFor': {
            value: function(symbol) {
                for (var key in forMap) {
                    if (forMap[key] === symbol) return key;
                }
            },
            writable: true,
            enumerable: false,
            configurable: true
        }
    });

    root.SymbolPolyfill = SymbolPolyfill;

})()

const Symbol = SymbolPolyfill;

var str = Symbol('foo');
var s4 = Symbol('foo');
var s2 = Symbol.for('foo');
var s3 = Symbol.for('foo');

console.log(str === s2); // false
console.log(s2 === s3); // true
console.log(str === s4); // false