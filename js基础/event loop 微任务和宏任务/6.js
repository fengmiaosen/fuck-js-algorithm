// 继续在Promise中实例化Promise，其输出依然会早于setTimeout的宏任务
// 参考 https://juejin.im/post/5b73d7a6518825610072b42b

setTimeout(_ => console.log(4))

new Promise(resolve => {
    resolve()
    console.log(1)
}).then(_ => {
    console.log(3)

    Promise.resolve().then(_ => {
        console.log('before timeout')
    }).then(_ => {
        Promise.resolve().then(_ => {
            console.log('also before timeout')
        })
    })
})

console.log(2)
