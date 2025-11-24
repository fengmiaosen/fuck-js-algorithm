

* useImperativeHandle 可以让你在使用 ref 时自定义暴露给父组件的实例值。在大多数情况下，应当避免使用 ref 这样的命令式代码。
* useImperativeHandle 应当与 forwardRef 一起使用（React 19 之前）

### demo

```jsx
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

## 总结

### 特点

- 自定义暴露给父组件的 `ref` 句柄，仅公开需要的命令式方法。
- 需在组件顶层调用，`createHandle` 返回的对象会赋值到 `ref.current`。
- 依赖数组必须涵盖 `createHandle` 中用到的所有响应式值；依赖变更时重新生成句柄（`Object.is` 比较）。
- 仅用于无法声明式表达的行为（聚焦、滚动、选择文本、触发动画等），避免过度使用。

### 典型使用场景

- 封装输入组件，只暴露 `focus`、`scrollIntoView` 等有限方法，而不是整个 DOM 节点。
- 列表/帖子组件，向父组件暴露如 `scrollAndFocusAddComment` 等组合动作。
- 复杂可视化或动画组件，暴露 `play`、`pause`、`seek` 等控制方法。
- 表单容器，暴露 `reset`、`validate` 等命令式入口（仍建议优先使用受控 props）。

### 版本差异：React 19 vs 之前版本

- React 19：函数组件可以直接接收 `ref` 作为 props 并使用 `useImperativeHandle`，无需 `forwardRef`。

```jsx
// React 19 写法：组件直接接收 ref
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref }) {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus() { inputRef.current?.focus(); },
    scrollIntoView() { inputRef.current?.scrollIntoView(); },
  }), []);
  return <input ref={inputRef} />;
}
```

- React 18 及更早：必须用 `forwardRef` 将 `ref` 传入函数组件。

```jsx
// React 18 及更早写法：forwardRef 传递 ref
import { useRef, useImperativeHandle, forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus() { inputRef.current?.focus(); },
    scrollIntoView() { inputRef.current?.scrollIntoView(); },
  }), []);
  return <input ref={inputRef} />;
});
```

注意：无论哪个版本，避免用 `ref` 暴露如 `{ open, close }` 的状态控制；更推荐用声明式的 `<Modal isOpen={isOpen} />` 以及副作用驱动行为。

### 参考资料
[如何在函数组件中拿到 form 实例？](https://3x.ant.design/components/form-cn/#%E5%A6%82%E4%BD%95%E5%9C%A8%E5%87%BD%E6%95%B0%E7%BB%84%E4%BB%B6%E4%B8%AD%E6%8B%BF%E5%88%B0-form-%E5%AE%9E%E4%BE%8B%EF%BC%9F)

[useImperativeHandle](https://react.dev/reference/react/useImperativeHandle)
