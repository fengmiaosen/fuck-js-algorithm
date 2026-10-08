# async / await 与 promise 的执行顺序

> 文件：`index.js`　运行：`node index.js`

`async/await` 只是 promise 的语法糖，但「糖」里藏了两条容易踩的规则：**`await` 会让出执行权（微任务）**，**`return await` 和 `return` 在 try/catch 里不等价**。

## 一、题目

```javascript
async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}
async function async2() { console.log('async2') }

console.log('script start')
setTimeout(() => console.log('setTimeout'), 0)
async1()
new Promise(resolve => { console.log('promise1'); resolve() }).then(() => console.log('promise2'))
console.log('script end')
```

请写出输出顺序。其余小题见 `index.js`。

## 二、Q1 逐步拆解

### 第 1 步：同步阶段（调用栈）

| 顺序 | 代码 | 输出 / 动作 |
| --- | --- | --- |
| 1 | `console.log('script start')` | `script start` |
| 2 | `setTimeout(...)` | 注册**宏任务** |
| 3 | `async1()` | 进入函数，打印 `async1 start` |
| 4 | `await async2()` | **先同步执行** `async2()` → 打印 `async2`；然后 `async1` 在此挂起，后续代码注册为**微任务** |
| 5 | `new Promise(executor)` | executor 同步执行 → 打印 `promise1`，`.then` 注册微任务 `promise2` |
| 6 | `console.log('script end')` | `script end` |

同步代码跑完时：

- 微任务队列：`[async1 的后续, promise2]`
- 宏任务队列：`[setTimeout]`

### 第 2 步：清空微任务 → 再执行宏任务

```
script start
async1 start      ← 同步
async2            ← await 后面的函数体是同步执行的
promise1          ← executor 同步执行
script end        ← 同步
async1 end        ← 微任务
promise2          ← 微任务
setTimeout        ← 宏任务
```

### 三条记忆规则

1. `await` **左边**的表达式是同步执行的（`async2()` 立即调用）；`await` **右边**的代码才是微任务。
2. `async` 函数里 `await` 之后的代码，等价于写在 `.then` 里。
3. 微任务永远先于宏任务（`setTimeout`）执行。

> 补充：现代 V8 对 `await` 一个已 fulfilled 的**原生** promise 做了优化，大约让出 1 拍微任务（按规范最多可以是 3 拍）。面试时说出「微任务、在同步代码之后、在 setTimeout 之前」即可，不必纠结具体拍数。

## 三、其余小题解析

### Q2 `await` 一个普通值也会让出执行权

```javascript
console.log('Q2 a')
;(async () => { await 1; console.log('Q2 await 之后的代码') })()
Promise.resolve().then(() => console.log('Q2 then 回调'))
console.log('Q2 同步代码')
```

`await 1` 内部等价于 `Promise.resolve(1).then(续体)`，所以「await 之后的代码」依然是微任务，排在同步代码之后。
而它和 `then 回调` 的先后，取决于**谁先入队**：`await` 在 async 函数被调用时就入了队，因此先于后面的 `then`：

```
Q2 a
Q2 同步代码
Q2 await 之后的代码
Q2 then 回调
```

### Q3 `async` 函数永远返回新的 promise

| 写法 | 结果 |
| --- | --- |
| `async function f() { return 1 }` | 返回 fulfilled promise，值 `1` |
| `async function f() { return Promise.resolve(2) }` | 返回**新的** promise，跟随内层，值 `2`，但 `f() !== inner` |
| `async function f() { throw e }` | 返回 rejected promise |

所以 `async` 函数的返回值一定可以被 `.then/.catch/await`，并且**永远不会把内层 promise 原样返回**。

### Q4 / Q5 `try/catch` 与 `return await`

`await` 会把 rejection 变成同步意义上的「抛出」，所以能被本地 `try/catch` 捕获：

```javascript
async function withAwait() {
  try {
    return await Promise.reject(new Error('with await'))
  } catch (e) {
    return `caught: ${e.message}`      // ✅ 会执行
  }
}

async function withoutAwait() {
  try {
    return Promise.reject(new Error('without await'))
  } catch (e) {
    return `caught: ${e.message}`      // ❌ 不会执行
  }
}
```

**原因**：`return Promise.reject(...)` 是把 promise 直接交出去，函数立刻返回；错误发生在函数**返回之后**，本地 `catch` 自然抓不到，只能由调用方的 `.catch` 接住。

> 这也是「加了 `await` 以后错误堆栈更完整」的原因；但 `return await` 会多等一拍微任务，非必要可以不写。

### Q6 `async` 里 `throw` = 返回 rejected promise

`throw` 和 `return Promise.reject(...)` 在 async 函数里效果一致。

### Q7 `await` 一个 thenable

`await` 内部同样走 promise 的决议程序（见 `then返回promise的递归展开`），所以一个有 `then` 方法的对象也能被 `await`：

```
Q7 await 之前
Q7 thenable.then 被调用
Q7 await 之后: thenable-value
```

## 四、运行结果

```bash
node index.js
```

```
===== Q1 async / await 执行顺序 =====
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout

===== Q2 await 普通值也会让出执行权 =====
Q2 a
Q2 同步代码
Q2 await 之后的代码
Q2 then 回调

===== Q3 async 的返回值 =====
Q3 返回的一定是 promise: true true
Q3 值: 1 2
Q3 async 返回的 promise 不是 inner 本身: true | 值为: inner

===== Q4 try / catch 捕获 await 的错误 =====
Q4 捕获: await 的错误

===== Q5 return await 与 return 的区别 =====
Q5 return await : caught: with await
Q5 return       : uncaught: without await

===== Q6 async 里 throw =====
Q6 被 catch 捕获: async throw

===== Q7 await 一个 thenable =====
Q7 await 之前
Q7 thenable.then 被调用
Q7 await 之后: thenable-value
```

## 五、用 async/await 改写 loadUrl 链

同一段业务，两种写法等价（`async/await` 本质是 `.then` 的语法糖）：

```javascript
// promise 链式写法
loadUrl('/api/user')
  .then(user => loadUrl(`/api/detail/${user.id}`))
  .then(detail => console.log(detail))
  .catch(e => console.log(e))

// async/await 写法
async function main() {
  try {
    const user = await loadUrl('/api/user')          // 串行，等价于 then 里 return promise
    const detail = await loadUrl(`/api/detail/${user.id}`)
    console.log(detail)
  } catch (e) {
    console.log(e)                                    // 等价于链路末尾的 catch
  }
}
```

区别只在于：`await` 写法里每一行都**同步地等着**，而 `.then` 写法把「等待」藏在链里。理解了 `.then` 的返回值语义，就理解了 `await`。
