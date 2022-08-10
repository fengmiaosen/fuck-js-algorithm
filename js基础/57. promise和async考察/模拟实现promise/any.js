// https://juejin.cn/post/6965596525388890142?utm_source=gold_browser_extension
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/any
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/AggregateError

/**
 * Promise.any 
 * 只要传入的 promise 有一个是 fullfilled 则立即 resolve 出去，否则将所有 reject 结果收集起来并返回 AggregateError
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/any
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/AggregateError
 * @param {Promise[]} promises 
 * @returns 
 */
function promiseAny(promises) {
    return new Promise((resolve, reject) => {
        let count = 0
        let results = []

        promises.forEach(p => {
            Promise.resolve(p).then(data => {
                resolve(data)
            }).catch(e => {
                count++
                results.push(e)

                if (count === promises.length) {
                    reject(new AggregateError(results))
                }
            })
        })
    })
}

var p1 = Promise.resolve(1),
    p2 = Promise.resolve(2),
    p3 = Promise.resolve(3);
let p4 = Promise.reject(4)
let p5 = Promise.reject(5)

promiseAny([p4, p5]).then(function (value) {
    console.log(value)
})