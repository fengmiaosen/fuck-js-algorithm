/**
 * 模拟实现promise.race
 * @param {array} promises 
 * @returns 
 */
function promiseRace(promises) {

    return new Promise((resolve, reject) => {
        for (let item of promises) {
            Promise.resolve(item).then((res) => {
                resolve(item)
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

promiseRace([p1, p2, p3, p4]).then(function (value) {
    console.log(value)
})
