// https://mp.weixin.qq.com/s/vFluh-_5ou0a_PnfLZacpA

// 1. 当执行 then 方法时，如果前面的 promise 已经是 resolved 状态，则直接将回调放入微任务队列中
// 2. 当一个 promise 被 resolve 时，会遍历之前通过 then 给这个 promise 注册的所有回调，将它们依次放入微任务队列中
// then 只负责注册回调，由 resolve 将注册的回调放入微任务队列，由事件循环将其取出并执行

new Promise((resolve, reject) => {
    console.log("log: 外部promise");
    resolve();

}).then(() => {
    console.log("log: 外部第一个then");

    new Promise((resolve, reject) => {
        console.log("log: 内部promise");
        resolve();
    }).then(() => {
        console.log("log: 内部第一个then");
    }).then(() => {
        console.log("log: 内部第二个then");
    });

}).then(() => {
    console.log("log: 外部第二个then");
});

/**
 * log: 外部promise
 * log: 外部第一个then
 * log: 内部promise
 * log: 内部第一个then
 
 * log: 外部第二个then
 * log: 内部第二个then
 */

/**
### 关键执行原理
1. then 方法的作用 ：只负责注册回调函数，不立即执行
2. resolve 的作用 ：将注册的回调放入微任务队列
3. 微任务队列执行顺序 ：先进先出（FIFO）
4. 链式调用机制 ：每个 .then() 返回新的 Promise，只有当前 .then() 执行完毕后，下一个 .then() 才会被加入微任务队列
 */