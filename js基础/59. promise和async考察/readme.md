# Promise 和 async 考察

本目录收集 promise / async 相关的经典面试题。每个子目录都是一道（组）题，配 `readme.md` 解析 + 可直接 `node` 运行的代码。

## 本次新增：经典 promise 面试题

| # | 题目 | 考察点 | 目录 | 运行 |
| --- | --- | --- | --- | --- |
| 1 | **手写 loadUrl：支持多个 then 串行调用，中间还能插 catch** | then 返回新 promise、错误穿透、catch 后恢复、微任务、循环引用 | [手写loadUrl支持then链式调用](./手写loadUrl支持then链式调用/readme.md) | `node loadUrl.js` / `node test.js` |
| 2 | **then 的值穿透、错误穿透与 catch 恢复** | `then(null)` 值穿透、`catch` 洗白状态、同一个 then 的 `onRejected` 捕获范围、状态不可逆 | [then值穿透与catch恢复](./then值穿透与catch恢复/readme.md) | `node index.js` |
| 3 | **then 返回 promise 的递归展开** | 决议程序、thenable、`Promise.resolve(p) === p`、循环引用 TypeError、多等两拍微任务 | [then返回promise的递归展开](./then返回promise的递归展开/readme.md) | `node index.js` |
| 4 | **async / await 与 promise 的执行顺序** | 微任务顺序、`await` 让出执行权、async 返回值、`try/catch` 捕获 await、`return await` 与 `return` | [async await与promise执行顺序](<./async await与promise执行顺序/readme.md>) | `node index.js` |

### 题 1 的题目原型

有一个 `loadUrl` 函数返回 promise，要求支持多个 `then` 串行调用，且 `then` 中间还有 `catch`：

```javascript
loadUrl('/api/user')
  .then(user => user.name)          // 返回值交给下一个 then
  .then(name => { throw new Error('boom') })  // 抛错，跳过中间所有 then
  .catch(error => 'recovered')       // 捕获并恢复链
  .then(value => console.log(value)) // recovered
```

题 1 用**手写的 MyPromise**（不依赖原生 Promise）实现了这套语义，并用 `test.js` 与原生 Promise 输出序列对拍，确保一致。

## 已有内容

| 目录 | 内容 |
| --- | --- |
| [promise.all 和 any 以及 race 的区别](<./promise.all 和 any 以及 race 的区别/readme.md>) | 三个组合 API 的语义对比 |
| [Promise异步缓存&并发调度](./Promise异步缓存&并发调度/requestCache.js) | 相同请求只发一次的真实网络请求缓存 |
| `async语法/` | 待补充 |

## 相关目录（在本目录之外）

- `../57. promise和async考察/`：手写 `all/race/any/finally/retry`、promise sleep、请求超时、promise 取消与中断
- `../64. Promise并发调度/`、`../70. 异步串行编程题 实现 createFlow 函数/`、`../73. js实现并发控制/`

## 建议的刷题顺序

1. 先做 **题 2**（值穿透与 catch 恢复）—— 建立「链上每一步的返回值决定下一步状态」的直觉；
2. 再做 **题 3**（递归展开）—— 弄懂「返回 promise 为什么要多等」；
3. 然后做 **题 1**（手写 loadUrl / MyPromise）—— 把前两题的规则落成代码，跑 `test.js` 对拍；
4. 最后做 **题 4**（async/await 顺序）—— 把「链」和「语法糖」对应起来。
