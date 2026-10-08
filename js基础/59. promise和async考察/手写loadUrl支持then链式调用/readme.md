# 手写 loadUrl：支持多个 then 串行调用，中间还能插 catch

> 文件：`MyPromise.js`（手写 Promise 实现）、`loadUrl.js`（题目 + 参考实现 + 演示）、`test.js`（与原生 Promise 对拍）

## 一、题目描述

有一个 `loadUrl` 函数返回 promise，要求它支持**多个 `then` 串行调用**，并且 `then` 中间还有 `catch`：

```javascript
loadUrl('/api/user')
  .then(user => {
    console.log('then1', user)
    return user.name          // 返回值交给下一个 then
  })
  .then(name => {
    console.log('then2', name)
    throw new Error('boom')   // 抛错，跳过后面所有 then
  })
  .catch(error => {
    console.log('catch', error.message)
    return 'recovered'        // 返回普通值，链恢复成功
  })
  .then(value => {
    console.log('then3', value) // recovered
  })
```

要求输出顺序为：

```
then1 { name: 'Tom', age: 18 }
then2 Tom
catch boom
then3 recovered
```

难点在于：**不能用原生 `Promise`，要自己实现出这套链式语义** —— 也就是说，这道题本质是「手写 Promise」，`loadUrl` 只是它的业务外衣。

## 二、考察的知识点

| 考察点 | 说明 |
| --- | --- |
| `then` 返回新 promise | 链式调用的根基：`then` 必须 `return new Promise(...)`，否则第二个 `then` 无法接到上一步的结果 |
| 回调的返回值决定下一个状态 | 回调 `return` 普通值 → 下一个 fulfilled；`throw` → 下一个 rejected；`return promise` → 下一个「跟随」它 |
| `catch` 的本质 | `catch(fn)` 等价于 `then(null, fn)`，它同样返回新 promise，所以 `catch` 后面还能继续 `then` |
| catch 后链恢复 | `catch` 回调里 `return` 普通值，会把 rejected 状态「洗白」成 fulfilled |
| 错误穿透 | 上游出错后，中间的 `then`（没写 `onRejected`）会被跳过，直到最近的 `catch` |
| 值穿透 | `then(null)` / `then(undefined)` 时，结果原样传给下一个 `then` |
| 回调异步执行 | 所有 then/catch 回调都进微任务队列，绝不可能同步执行 |
| 状态不可逆 | 状态只能从 `pending` 变更一次，`resolve` 之后的 `reject` 是空操作 |
| 循环引用 | 回调返回自己所在的 promise，要抛 `TypeError: Chaining cycle detected` |

## 三、参考实现

### 1. 核心骨架：then 返回新 promise + 微任务派发

```javascript
then(onFulfilled, onRejected) {
  // 关键：then 一定返回一个全新的 promise，这是链式调用的基础
  return new MyPromise((resolve, reject) => {
    const handler = { onFulfilled, onRejected, resolve, reject }
    if (this.state === PENDING) {
      this.handlers.push(handler)          // 状态未定，先存起来
    } else {
      this._handle(handler)                // 已落定，直接派发
    }
  })
}

_handle({ onFulfilled, onRejected, resolve, reject }) {
  microtask(() => {
    const callback = this.state === FULFILLED ? onFulfilled : onRejected

    // 值穿透 / 错误穿透
    if (!isFunction(callback)) {
      return this.state === FULFILLED ? resolve(this.value) : reject(this.value)
    }

    try {
      resolve(callback(this.value))   // 返回值决定下一个 promise 的状态
    } catch (error) {
      reject(error)                   // 抛错 → 下一个 promise 失败
    }
  })
}

catch(onRejected) {
  return this.then(null, onRejected)   // catch 就是只传失败回调的 then
}
```

### 2. 业务外壳 loadUrl

```javascript
const MyPromise = require('./MyPromise')

// 模拟 ajax：把 setTimeout 包成 promise
const mockRequest = (url, delay = 20) =>
  new MyPromise((resolve, reject) => {
    setTimeout(() => {
      if (url === '/api/user') {
        resolve({ name: 'Tom', age: 18 })
      } else {
        reject(new Error(`404 Not Found: ${url}`))
      }
    }, delay)
  })

function loadUrl(url) {
  return mockRequest(url)
}
```

### 3. 为什么 `return promise` 会让「链」等下去

`_settle` 里遇到 thenable 时不会立刻落定，而是递归展开、采用它的状态，所以此时 promise 仍是 `pending`，后续 `then` 只能排队等待：

```javascript
if (isThenable(value)) {
  let then
  try {
    then = value.then
  } catch (error) {
    return this._settle(REJECTED, error, false)
  }

  if (isFunction(then)) {
    let called = false   // 防止 thenable 同时调用 resolve 和 reject
    then.call(
      value,
      next   => { if (!called) { called = true; this._settle(FULFILLED, next, true) } },
      reason => { if (!called) { called = true; this._settle(REJECTED, reason, false) } }
    )
    return   // 注意：此时 promise 仍是 pending，要等 thenable 自己落定
  }
}
```

## 四、运行结果

```bash
node loadUrl.js
```

```
=== 场景一：多个 then 串行 + 中间 catch ===
[+23ms] then1 收到: { name: 'Tom', age: 18 }
[+24ms] then2 收到: Tom
[+55ms] catch 之后的 then 收到: Tom's age is 18
--- 场景一结束（30ms 的 sleep 被等到，说明链是串行的）---

=== 场景二：失败被 catch 捕获后链继续 ===
[+147ms] catch 捕获: 404 Not Found: /api/not-exist
[+148ms] 恢复后的 then 收到: 降级数据

=== 场景三：then 链串行 vs Promise.all 并行 ===
串行 step1: step1
串行 step2: step2
串行总耗时: 105ms（约 100ms = 50 + 50）
并行总耗时: 52ms（约 50ms = max(50, 50)）
```

> 时间戳与机器性能有关，看数量级即可：**串行链的总耗时是各步之和，`Promise.all` 是各步的最大值**。

与原生 Promise 对拍（`node test.js`）：

```bash
node test.js
```

```
原生 Promise 输出序列:
  1. then1:1
  2. then2:2
  3. catch1:boom
  4. then3:recovered
  5. then4:nested-promise
  6. catch2:again
  7. finally
手写 MyPromise 输出序列:
  1. then1:1
  2. then2:2
  3. catch1:boom
  4. then3:recovered
  5. then4:nested-promise
  6. catch2:again
  7. finally

✅ 手写实现与原生 Promise 的输出序列完全一致
✅ MyPromise.resolve(p) === p（与原生一致，不会多包一层）
✅ 循环引用检测: TypeError | Chaining cycle detected for promise
✅ 手写 promise 可以被 await 消费: await-me
✅ 状态不可逆：resolve 之后再调用 reject 无效

🎉 全部用例通过
```

## 五、面试官常追问

1. **`then` 为什么必须返回新 promise？**
   如果返回 `this`，第 2 个 `then` 会在第 1 个回调执行前就注册到同一个实例上，两个回调拿到的是同一个值，链就断了；而且无法区分「上一步的结果」。

2. **回调为什么必须异步执行？**
   保证「回调一定在同步代码之后执行」，这也是 `Promise` 相比回调函数更可控的原因；统一用微任务还能保证多个 `then` 的先后顺序可预期。

3. **`return promise` 和 `return 值` 有什么执行顺序差别？**
   返回 promise 会多等两拍微任务（见 `then返回promise的递归展开`）。

4. **`catch` 之后为什么还能 `.then`？**
   因为 `catch` 也是 `then`，返回的是新的 fulfilled promise（前提是回调里没有继续 `throw`）。

5. **不用原生 Promise 怎么实现 `finally`？**
   见 `MyPromise.js` 的 `finally`：用 `MyPromise.resolve(onFinally()).then(() => value)` 保留原值、用 `throw reason` 保留原错误。
