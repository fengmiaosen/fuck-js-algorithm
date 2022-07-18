// https://redux.js.org/api/compose
// 从右到左来组合多个函数。
// 这是函数式编程中的方法，为了方便，被放到了 Redux 里。
// 当需要把多个 store 增强器 依次执行的时候，需要用到它
// compose(funcA, funcB, funcC) 形象为 compose(funcA(funcB(funcC())))
// 参考 https://segmentfault.com/a/1190000015801987

function compose(...funcs) {

    if (funcs.length === 0) {
        return arg => arg;
    }

    if (funcs.length === 1) {
        return funcs[0];
    }

    return funcs.reduce((a, b) =>
        (...args) => a(b(...args))
    );
}

let x = 10
function fn1(x) { return x + 1 }
function fn2(x) { return x + 2 }
function fn3(x) { return x + 3 }
function fn4(x) { return x + 4 }

// 假设我这里想求得这样的值
let a = fn1(fn2(fn3(fn4(x)))) // 10 + 4 + 3 + 2 + 1 = 20

// 根据compose的功能，我们可以把上面的这条式子改成如下：
let composeFn = compose(fn1, fn2, fn3, fn4)
let b = composeFn(x) // 理论上也应该得到20

console.log('a :', a)
console.log('b :', b)