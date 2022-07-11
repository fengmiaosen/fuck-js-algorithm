// Promise.race竞速方法
// 利用这一特性，也能达到后续的Promise不再执行


let p1 = new Promise((resolve, reject) => {
    resolve('ok1')
})

let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {resolve('ok2')}, 10)
})

Promise.race([p2, p1]).then((result) => {
    console.log(result) //ok1
}).catch((error) => {
    console.log(error)
})
