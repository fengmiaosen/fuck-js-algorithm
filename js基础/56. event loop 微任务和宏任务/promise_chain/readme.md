# Promise 链式调用执行过程分析

## 代码示例

```javascript
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
```

## 执行结果

```
log: 外部promise
log: 外部第一个then
log: 内部promise
log: 内部第一个then
log: 外部第二个then
log: 内部第二个then
```

## 详细执行过程分析

### 第1步：同步代码执行
- 创建外部 Promise，执行构造函数
- `console.log("log: 外部promise")` → 输出：**log: 外部promise**
- `resolve()` 立即将 Promise 状态改为 fulfilled
- 外部第一个 `.then()` 回调被加入微任务队列

### 第2步：第一轮微任务执行
- 执行外部第一个 `.then()` 回调：
  - `console.log("log: 外部第一个then")` → 输出：**log: 外部第一个then**
  - 创建内部 Promise，执行构造函数
  - `console.log("log: 内部promise")` → 输出：**log: 内部promise**
  - 内部 `resolve()` 执行，内部第一个 `.then()` 回调被加入微任务队列
  - 外部第一个 `.then()` 执行完毕，外部第二个 `.then()` 回调被加入微任务队列

### 第3步：第二轮微任务执行
- 微任务队列中有两个任务：内部第一个 `.then()` 和外部第二个 `.then()`
- 按照加入顺序，先执行内部第一个 `.then()`：
  - `console.log("log: 内部第一个then")` → 输出：**log: 内部第一个then**
  - 内部第二个 `.then()` 回调被加入微任务队列

### 第4步：第三轮微任务执行
- 执行外部第二个 `.then()`：
  - `console.log("log: 外部第二个then")` → 输出：**log: 外部第二个then**

### 第5步：第四轮微任务执行
- 执行内部第二个 `.then()`：
  - `console.log("log: 内部第二个then")` → 输出：**log: 内部第二个then**

## 关键执行原理

### 1. then 方法的作用
- **只负责注册回调函数**，不立即执行
- 返回新的 Promise 对象，支持链式调用

### 2. resolve 的作用
- **将注册的回调放入微任务队列**
- 触发 Promise 状态变更为 fulfilled

### 3. 微任务队列执行顺序
- **先进先出（FIFO）**原则
- 每轮事件循环都会清空当前微任务队列

### 4. 链式调用机制
- 每个 `.then()` 返回新的 Promise
- **只有当前 `.then()` 执行完毕后，下一个 `.then()` 才会被加入微任务队列**

## 执行时序图

```
同步阶段：
  外部promise → 外部第一个then加入队列

微任务1：
  外部第一个then → 内部promise → 内部第一个then加入队列 → 外部第二个then加入队列

微任务2：
  内部第一个then → 内部第二个then加入队列

微任务3：
  外部第二个then

微任务4：
  内部第二个then
```

## 重要概念总结

### Promise 执行机制
1. **构造函数同步执行**：Promise 构造函数中的代码立即执行
2. **then 异步执行**：`.then()` 中的回调函数异步执行
3. **微任务优先级**：Promise 回调属于微任务，优先级高于宏任务

### 嵌套 Promise 处理
1. **内外 Promise 独立**：内部 Promise 不会阻塞外部 Promise 的链式调用
2. **微任务交替执行**：内外 Promise 的回调会按照加入微任务队列的顺序交替执行
3. **链式调用延续**：外部 Promise 的下一个 `.then()` 会在当前 `.then()` 执行完毕后加入队列

### 实际应用场景
- **异步操作串联**：多个异步操作需要按顺序执行
- **错误处理链**：统一处理多个异步操作的错误
- **数据转换管道**：对异步获取的数据进行多步转换处理

这个示例完美展示了 Promise 链式调用中微任务的执行顺序和嵌套 Promise 的处理机制，是理解 JavaScript 异步编程的重要案例。