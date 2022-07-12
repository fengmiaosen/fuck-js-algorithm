function promiseAll(promises) {

    return new Promise((resolve, reject) => {
        let count = 0
        let res = []

        promises.forEach(p => {
            Promise.resolve(p).then(data => {
                count++
                res.push(data)

                if (count === promises.length) {
                    resolve(res)
                }
            }).catch(e => {
                reject()
            })
        })
    })
}

// 方法返回一个 promise，一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。
function promiseRace(promises) {
    return new Promise((resolve, reject) => {
        promises.forEach(p => {
            Promise.resolve(p).then(resolve, reject)
        })
    })
}

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

Promise.prototype.finally = (callback) => {
    let P = this.constructor

    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => {
            throw reason
        })
    )
}

var p1 = Promise.resolve(1),
    p2 = Promise.resolve(2),
    p3 = Promise.resolve(3);
let p4 = Promise.reject(4)
let p5 = Promise.reject(5)

promiseAll([p1, p2, p3]).then(function (value) {
    console.log(value)
})

promiseRace([p1, p2, p4]).then(function (value) {
    console.log(value)
})

promiseAny([p4, p5]).then(function (value) {
    console.log(value)
})