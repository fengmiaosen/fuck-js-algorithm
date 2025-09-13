/**
 * 模拟实现promise.all
 * @param {array} promises 
 * @returns 
 */
function promiseAll(promises) {

    return new Promise((resolve, reject) => {
        let count = 0
        let results = []

        for (let item of promises) {
            Promise.resolve(item).then((res) => {
                count++
                results.push(res)

                if (count === promises.length) {
                    resolve(results)
                }
            }).catch(err => {
                reject();
            })
        }
    })
}


var p1 = Promise.resolve(1);
var p2 = Promise.resolve(2);
var p3 = Promise.resolve(3);
var p4 = 4;

promiseAll([p1, p2, p3, p4]).then(function (value) {
    console.log(value)
})
