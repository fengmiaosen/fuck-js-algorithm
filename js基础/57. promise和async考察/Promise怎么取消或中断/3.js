// 当Promise链中抛出一个错误时，错误信息沿着链路向后传递，直至被捕获。
// 利用这一特性能跳过链中被捕获前的函数的调用，直至链路终点。

Promise.resolve().then(() => {
    console.log('ok1')
    throw 'throw error1'

}).then(() => {
    console.log('ok2')
}, err => {
    // 捕获错误
    console.log('err->', err)
}).then(() => {
    // 该函数将被调用
    console.log('ok3')
    throw 'throw error3'
}).then(() => {
    // 错误捕获前的函数不会被调用
    console.log('ok4')
}).catch(err => {
    console.log('err->', err)
})
