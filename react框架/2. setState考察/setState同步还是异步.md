# React 中 setState 是同步还是异步？

## 结论

1.  **React 18 及以后**：**默认都是“异步”（批处理）的**。
    *   无论是 React 合成事件、生命周期，还是 `setTimeout`、`Promise`、原生 DOM 事件，React 18 都会自动进行**批处理 (Automatic Batching)**。
    *   多次 `setState` 只会合并触发一次重渲染。
    *   如果需要强制同步更新（即刻写入 DOM），需使用 `ReactDOM.flushSync`。

2.  **React 17 及以前（Legacy）**：**看情况**。
    *   **在 React 合成事件（onClick 等）和生命周期中**：是**异步**的（批处理）。
    *   **在 `setTimeout`、`setInterval`、原生 DOM 事件中**：是**同步**的（立即更新 DOM，不合并）。

---

## 详细解析

### 1. 所谓的“异步”是什么意思？
这里的“异步”并不是指 JavaScript 的 Event Loop 异步（microtask/macrotask），而是指 React 的**延后更新策略**。
*   当你调用 `setState` 时，React 并没有立即更新组件，而是把这次更新放入一个队列中，并标记组件为“脏”（dirty）。
*   React 会在一个“事务”结束时，统一处理队列中的状态更新，合并多次 `setState`，然后一次性进行 Diff 和渲染。
*   **目的**：性能优化。避免因连续多次修改状态而导致多次无意义的 DOM 渲染。

### 2. 代码示例对比

#### 经典面试题（类组件）

```javascript
class Example extends React.Component {
  state = { count: 0 };

  componentDidMount() {
    // A. React 生命周期内
    this.setState({ count: this.state.count + 1 });
    console.log(this.state.count);

    this.setState({ count: this.state.count + 1 });
    console.log(this.state.count);

    // B. 异步回调中
    setTimeout(() => {
      this.setState({ count: this.state.count + 1 });
      console.log(this.state.count);

      this.setState({ count: this.state.count + 1 });
      console.log(this.state.count);
    }, 0);
  }
  render() { return null; }
}
```

#### 不同版本的输出结果：

| 版本 | A 处 (生命周期) | B 处 (setTimeout) | 说明 |
| :--- | :--- | :--- | :--- |
| **React 17** | `0`, `0` | `2`, `3` | 生命周期内批处理（异步）；setTimeout 逃逸了 React 管控，变成同步。 |
| **React 18** | `0`, `0` | `1`, `1` | **全部批处理**。setTimeout 里也是异步合并，`this.state` 在本轮事件循环结束前未变。 |

### 3. React 18 的自动批处理 (Automatic Batching)

在 React 18 之前，只有在 React 自己的事件处理函数中才会有批处理。
在 React 18 中，`createRoot` 启用了所有场景的批处理。

```javascript
// React 18
function handleClick() {
  setTimeout(() => {
    setCount(c => c + 1);
    setFlag(f => !f);
    // React 17: 渲染两次
    // React 18: 只渲染一次
  }, 1000);
}
```

### 4. 如何在 React 18 中强制同步？

如果你在设置状态后，需要立即从 DOM 中获取最新的尺寸或属性（极其少见的场景），可以使用 `flushSync`。

```javascript
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCount(c => c + 1);
  });
  // 此时 DOM 已经更新
  console.log(ref.current.scrollTop); 
}
```

### 5. useState (Hooks) 的情况
`useState` 的 `set` 函数表现与类组件的 `setState` 基本一致：
*   **React 18**：永远是异步批处理。
*   **注意**：函数组件中 `count` 是一个常量（闭包），即使是“同步”更新，在当次渲染闭包中读取的 `count` 也永远是旧值。要看新值必须等待下一次渲染函数执行。

```javascript
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(count + 1);
  // 无论同步异步，这里打印的 count 永远是 0 (闭包)
  console.log(count); 
};
```
