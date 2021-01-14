// 输出以下代码运行结果，为什么？如果希望每隔 1s 输出一个结果，应该如何改造？注意不可改动 square 方法

const list = [1, 2, 3]
const square = num => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(num * num)
        }, 1000)
    })
}

// // 原题目
// //forEach是不能阻塞的，默认是请求并行发起，所以是同时输出1、4、9。
// function test() {
//   list.forEach(async x=> {
//     const res = await square(x)
//     console.log(res)
//   })
// }

// 解决方案一：
// 改用for循环
async function test() {

    for (let i = 0; i < list.length; i++) {
        let res = await square(list[i]);
        console.log('res:', res);
    }
}

// // 解决方案二：
// // 改用for of循环
// async function test() {

//     for (let item of list) {
//         let res = await square(item);
//         console.log('res:', res);
//     }
// }

test()
