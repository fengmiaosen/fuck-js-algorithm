# then 返回 promise 的递归展开

> 文件：`index.js`　运行：`node index.js`

`then` 回调里 `return promise` 和 `return 值`，看起来只差一个写法，实际差了两拍微任务，也是各种「输出顺序题」的源头。

## 一、题目

```javascript
// Q1 链会等待返回的 promise
Promise.resolve(1)
  .then(v => Promise.resolve(v + 1))
  .then(v => console.log(v))   // 2，不是 Promise

// Q2 resolve 一个 thenable
new Promise(resolve => resolve({
  then(res) { res('thenable-value') }
})).then(v => console.log(v))  // thenable-value

// Q3 Promise.resolve(p) 和 new Promise(r => r(p)) 的区别
const p = Promise.resolve('inner')
console.log(Promise.resolve(p) === p)          // ?
console.log(new Promise(r => r(p)) === p)      // ?

// Q4 循环引用
const self = Promise.resolve().then(() => self)

// Q5 顺序题
Promise.resolve().then(() => { console.log('t1'); return Promise.resolve() }).then(() => console.log('t2'))
Promise.resolve().then(() => console.log('t3')).then(() => console.log('t4'))
```

## 二、核心规则：Promise 决议程序（简化版）

`resolve(value)` 并不是简单地把 `value` 存起来，而是要判断 `value` 是什么：

```
resolve(value)
├── value === 自己        → reject(TypeError: Chaining cycle detected)
├── value 是对象/函数
│   └── 取 value.then
│       ├── 不是函数      → 当成普通值，直接落定
│       └── 是函数        → 递归展开：调用 value.then(resolve, reject)，采用它的状态
└── 其它                 → 普通值，直接落定
```

对应手写实现里的这一小段（见 `手写loadUrl支持then链式调用/MyPromise.js`）：

```javascript
_resolve(value) {
  if (value === this) {
    // 循环引用
    this._settle(REJECTED, new TypeError('Chaining cycle detected for promise'), false)
    return
  }
  if (isThenable(value)) {
    let then = value.then
    if (isFunction(then)) {
      let called = false   // 只认第一次
      then.call(value,
        next   => { if (!called) { called = true; this._settle(FULFILLED, next, true) } },
        reason => { if (!called) { called = true; this._settle(REJECTED, reason, false) } })
      return   // 保持 pending，等 thenable 落定
    }
  }
  // 普通值
  this._settle(FULFILLED, value, true)
}
```

关键结论：**返回值是 thenable 时，promise 会停留在 `pending`，直到那个 thenable 落定，并且以后者的结果作为自己的结果。** 这就是「链会自动等待」的原因，也是 `async/await` 能直接 `return` 一个 promise 的底层机制。

## 三、逐题解析

### Q1 · Q2：展开是递归的

`return Promise.resolve(v + 1)` 时，第二个 `then` 拿到的不是 promise 对象，而是它内部的值 `2`。`resolve` 一个 `{ then(resolve) {...} }` 的普通对象同理，它被称为 **thenable**，一个对象只要有 `then` 方法就能被 promise「吸收」。

### Q3：`Promise.resolve(p)` 不包装，`new Promise(r => r(p))` 才跟随

| 写法 | 结果 |
| --- | --- |
| `Promise.resolve(p)` | 直接返回 `p` 本身（`=== p` 为 `true`） |
| `new Promise(r => r(p))` | 新建一个 promise，并**跟随** `p`（`=== p` 为 `false`，但最终值相同） |

原因是 `new Promise` 的 `resolve` 一定会走上面那套决议程序，而 `Promise.resolve` 有短路优化。
> 手写实现里对应 `MyPromise.resolve` 的 `if (value instanceof MyPromise) return value`。

### Q4：返回自身 → TypeError

```javascript
const self = Promise.resolve().then(() => self)
// TypeError: Chaining cycle detected for promise #<Promise>
```

自己等自己会永远 pending，所以规范要求直接抛 `TypeError`。注意：只有**直接**返回自己才会被检测到。

### Q5：为什么 `return promise` 会多等两拍微任务

同步代码执行完后，微任务队列是 `[A1, B1]`：

| 时刻 | 执行 | 队列变化 |
| --- | --- | --- |
| 第 1 拍 | `A1` 打印 `t1`，返回 `Promise.resolve()`（thenable）→ 需要展开，挂起 | `[A2(展开 inner), B2]` |
| 第 1 拍 | `B1` 打印 `t3`，返回 `undefined`，直接落定 | 队列里排入 `B2` |
| 第 2 拍 | `A2` inner 落定 → A 链重新入队 | `[A3, B2]` |
| 第 2 拍 | `B2` 打印 `t4` | `[A3]` |
| 第 3 拍 | `A3` 打印 `t2` | 空 |

所以顺序是 `t1 → t3 → t4 → t2`，`return 值` 的链（B）反超了 `return promise` 的链（A）。

### Q6 · Q7 · Q8：thenable 的边界

- `then` 不是函数（如 `{ then: 'not-a-function' }`）→ 当成普通值处理，不做展开；
- `then` 内部抛错 → 外层 promise 变为 rejected（`resolve` 过程中的异常不会丢）；
- `then` 同时调用 `resolve` 和 `reject` → 只认第一次，后面全部忽略。

## 四、运行结果

```bash
node index.js
```

```
===== Q1 return promise 会被展开 =====
Q1 第一个 then 收到: 1
Q1 第二个 then 收到的是展开后的值: 2

===== Q2 resolve(thenable) 采用其状态 =====
Q2 thenable 的 then 被调用
Q2 结果: thenable-value

===== Q3 Promise.resolve(p) vs new Promise(r => r(p)) =====
Q3 Promise.resolve(p) === p: true
Q3 followed === p: false
Q3 followed 的值: inner

===== Q4 返回自身的循环引用 =====
Q4 TypeError | Chaining cycle detected for promise #<Promise>

===== Q5 return promise 会多等两拍微任务 =====
Q5 t1
Q5 t3
Q5 t4
Q5 t2
Q5 顺序: t1 → t3 → t4 → t2

===== Q6 then 不是函数时按普通值处理 =====
Q6 拿到的对象: { then: 'not-a-function' }

===== Q7 thenable 内部抛错 → rejected =====
Q7 捕获: then 内部抛错

===== Q8 thenable 同时 resolve 和 reject 只认第一次 =====
Q8 resolve: 第一次生效
```

## 五、结合 loadUrl 看

```javascript
loadUrl('/api/user')
  .then(user => loadUrl(`/api/detail/${user.id}`))  // 返回 promise → 链自动等待下一个请求
  .then(detail => console.log(detail))
  .catch(e => console.log(e))
```

这里第二个 `then` 能拿到 detail 而不是 promise，靠的就是本节说的递归展开；请求失败时靠错误穿透走到 `catch`。
