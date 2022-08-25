

* useImperativeHandle 可以让你在使用 ref 时自定义暴露给父组件的实例值。在大多数情况下，应当避免使用 ref 这样的命令式代码。
* useImperativeHandle 应当与 forwardRef 一起使用：

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

### 参考资料
[如何在函数组件中拿到 form 实例？](https://3x.ant.design/components/form-cn/#%E5%A6%82%E4%BD%95%E5%9C%A8%E5%87%BD%E6%95%B0%E7%BB%84%E4%BB%B6%E4%B8%AD%E6%8B%BF%E5%88%B0-form-%E5%AE%9E%E4%BE%8B%EF%BC%9F)

[useimperativehandle](https://zh-hans.reactjs.org/docs/hooks-reference.html#useimperativehandle)
