`Promise.all`、`Promise.any` 和 `Promise.race` 是 JavaScript 中处理多个 Promise 的三种不同方法。它们之间的主要区别在于如何处理 Promise 的结果和失败。

### 1. **`Promise.all`**
- **描述**：接收一个 Promise 的可迭代对象（如数组），并返回一个新的 Promise。
- **行为**：
  - 只有当所有输入的 Promise 都成功时，返回的 Promise 才会成功，返回的结果是一个数组，包含所有成功 Promise 的结果。
  - 如果其中任何一个 Promise 失败，返回的 Promise 会立即失败，返回那个失败 Promise 的原因。

```javascript
const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = Promise.reject(new Error('Error'));

Promise.all([promise1, promise2])
  .then(results => console.log(results)) // [1, 2]
  .catch(error => console.error(error)); // 不会被调用

Promise.all([promise1, promise3])
  .then(results => console.log(results)) // 不会被调用
  .catch(error => console.error(error)); // Error: Error
```

### 2. **`Promise.any`**
- **描述**：接收一个 Promise 的可迭代对象，并返回一个新的 Promise。
- **行为**：
  - 只要有一个输入的 Promise 成功，返回的 Promise 就会成功，返回那个成功 Promise 的结果。
  - 如果所有的 Promise 都失败，返回的 Promise 会失败，并返回一个 `AggregateError` 对象，包含所有失败的原因。

```javascript
const promise1 = Promise.reject(new Error('Error 1'));
const promise2 = Promise.reject(new Error('Error 2'));
const promise3 = Promise.resolve(3);

Promise.any([promise1, promise2, promise3])
  .then(result => console.log(result)) // 3
  .catch(error => console.error(error)); // 不会被调用

Promise.any([promise1, promise2])
  .then(result => console.log(result)) // 不会被调用
  .catch(error => console.error(error)); // AggregateError: All promises were rejected
```

### 3. **`Promise.race`**
- **描述**：接收一个 Promise 的可迭代对象，并返回一个新的 Promise。
- **行为**：
  - 返回的 Promise 会在第一个输入 Promise 完成（无论成功还是失败）时完成，返回的是第一个 Promise 的结果。

```javascript
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => resolve('First'), 100);
});
const promise2 = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Second'), 50);
});
const promise3 = new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error('Error')), 75);
});

Promise.race([promise1, promise2, promise3])
  .then(result => console.log(result)) // 'Second'
  .catch(error => console.error(error)); // 不会被调用
```

### 总结
- **`Promise.all`**：所有 Promise 成功时成功，任一失败时失败。
- **`Promise.any`**：任一成功时成功，所有失败时失败。
- **`Promise.race`**：第一个完成（成功或失败）时的结果。