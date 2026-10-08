# then 的值穿透、错误穿透与 catch 恢复

> 文件：`index.js`　运行：`node index.js`

这道题是 promise 输出题的「母题」，`loadUrl` 链中间夹 `catch` 能正常工作，靠的就是下面这几条规则。建议先自己在纸上写答案，再运行对照。

## 一、题目

```javascript
// Q1 值穿透
Promise.resolve('A').then(null).then(undefined).then(v => console.log('Q1:', v))

// Q2 回调不写 return
Promise.resolve('B')
  .then(v => { console.log('Q2 第一个 then:', v) })   // 没有 return
  .then(v => console.log('Q2 第二个 then:', v))

// Q3 错误穿透
Promise.reject(new Error('boom'))
  .then(v => console.log('不会执行'))
  .then(v => console.log('也不会执行'))
  .catch(e => console.log('Q3 catch:', e.message))
  .then(v => console.log('Q3 catch 之后:', v))

// Q4 catch 返回普通值
Promise.reject('E1')
  .catch(e => `recovered:${e}`)
  .then(v => console.log('Q4:', v))

// Q5 catch 继续 throw
Promise.reject('E2')
  .catch(e => { throw new Error(`still ${e}`) })
  .then(v => console.log('不会执行'))
  .catch(e => console.log('Q5:', e.message))
```

## 二、逐题解析

### Q1 值穿透：`then(null)` 会原样传值

`then(onFulfilled, onRejected)` 里如果 `onFulfilled` 不是函数，promise 不会报错，而是**把当前值直接交给下一个 promise**：

```javascript
then(onFulfilled, onRejected) {
  return new MyPromise((resolve, reject) => {
    // ...
    if (!isFunction(callback)) {
      // 值穿透 / 错误穿透：原样往后传
      return this.state === FULFILLED ? resolve(this.value) : reject(this.value)
    }
  })
}
```

所以 `Q1: A`。错误穿透同理：`onRejected` 不是函数时，错误继续向后传，直到遇到真正的 `catch`。

### Q2 返回 undefined ≠ 值穿透

`then(v => { ... })` 传了回调但没 `return`，等价于 `return undefined`，下一个 `then` 收到的是 `undefined`，原来的值就丢了。

> 面试常考对比：`then(null)` → 值穿透，拿到 `'B'`；`then(v => {})` → 拿到 `undefined`。

### Q3 错误穿透直达最近的 catch

`Promise.reject` 之后，中间的 `then` 因为没写 `onRejected` 而被**跳过**（注意：跳过的是回调，不是这个 `then` 本身，`then` 仍然返回了新 promise）。错误透传到最近的 `catch`。
`catch` 回调返回 `undefined`，于是链恢复成 fulfilled，下一个 `then` 拿到 `undefined`。

### Q4 / Q5 catch 的返回值决定链的走向

| catch 回调里做的事 | 结果 |
| --- | --- |
| `return 普通值` | 链**恢复**成 fulfilled，后续 `then` 继续执行 |
| `throw 错误` | 链仍然是 rejected，冒泡到下一个 `catch` |
| `return Promise.reject(e)` | 同上，仍然是 rejected |

这正是「`loadUrl` 出错后还能继续 `.then`」的原理。

### Q6 同一个 then 的 `onRejected` 捕获不到 `onFulfilled` 的错误

```javascript
Promise.resolve('X').then(
  () => { throw new Error('onFulfilled 抛错了') },
  () => console.log('不会执行')     // 它只管上游传下来的错误
).catch(e => console.log(e.message))  // 由后面的 catch 捕获
```

**原因**：`onFulfilled` 是在**新 promise 的构造函数之外**的微任务里执行的，它抛的错只能让**新 promise** 失败；而 `onRejected` 是注册在**旧 promise** 上的，两者不在一个 promise 上。

### Q7 状态不可逆 + 一个 promise 可被多次订阅

`resolve('ok')` 之后调用 `reject(...)` 是空操作，状态只能变更一次。同一个 promise 上挂多个 `then`，它们都会拿到同一个值。

> 这个特性也是「promise 可以缓存结果」的基础（见 `Promise异步缓存&并发调度`）。

### Q8 executor 同步执行，回调异步执行

`new Promise(executor)` 里 executor 是**同步**执行的，所以它里面的 `console.log` 排在「同步代码」之前；而 `.then` 回调是**微任务**，永远在同步代码之后。

### Q9 错误被捕获后就结束了

第一个 `catch` 处理完并返回普通值后，错误不再向后传递，第二个 `catch` 不会执行。

## 三、运行结果

```bash
node index.js
```

```
===== Q1 值穿透 =====
Q1: A

===== Q2 返回 undefined 会吃掉值 =====
Q2 第一个 then 收到: B
Q2 第二个 then 收到: undefined

===== Q3 错误穿透 =====
Q3 catch 捕获: boom
Q3 catch 之后恢复为: undefined

===== Q4 catch 返回普通值 → 链恢复 =====
Q4 恢复成功: recovered:E1

===== Q5 catch 继续 throw → 向后冒泡 =====
Q5 继续冒泡到第二个 catch: still E2

===== Q6 同一个 then 里的 onRejected 捕获不到 onFulfilled 的错误 =====
Q6 由后续的 catch 捕获: onFulfilled 抛错了

===== Q7 状态不可逆 =====
Q7 第一个 then: ok
Q7 第二个 then 拿到同一个值: ok

===== Q8 executor 同步、回调异步 =====
Q8 executor 里的代码同步执行
Q8 同步代码先打印
Q8 then 回调最后打印: ok

===== Q9 错误被捕获后不再向后传递 =====
Q9 第一个 catch: once
```

## 四、一句话总结

| 写法 | 下一个 then 收到 |
| --- | --- |
| `.then(null)` / `.then(undefined)` | 原值（值穿透） |
| `.then(v => {})` | `undefined` |
| `.then(v => v + 1)` | 返回值 |
| `.then(() => { throw e })` | 跳过后续 then，直到 `catch` |
| `.catch(() => 值)` | 值，且链恢复 fulfilled |
| `.catch(() => { throw e })` | 继续被下一个 `catch` 捕获 |
