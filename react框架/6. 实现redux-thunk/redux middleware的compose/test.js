
// compose 函数
// 把 var a = fn1(fn2(fn3(fn4(x)))) 这种嵌套的调用方式改成 var a = compose(fn1,fn2,fn3,fn4)(x) 的方式调用

function compose(...fns) {

    if (fns.length === 0) {
        return args => args
    }

    if (fns.length === 1) {
        return fns[0]
    }

    return fns.reduce((acc, cur) => {
        return (...args) => {
            return acc(cur(...args))
        }
    })

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