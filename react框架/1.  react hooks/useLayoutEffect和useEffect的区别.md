

### useLayoutEffect和useEffect的区别

* useEffect 是`异步`执行的，而useLayoutEffect是`同步`执行的。

* useEffect 执行时机是浏览器完成渲染之后，而 useLayoutEffect 的执行时机是浏览器把内容真正渲染到界面之前，和 componentDidMount 等价。

### 示例

https://codesandbox.io/s/hardcore-framework-c5rtwr?file=/src/useEffectTest.jsx

```jsx
import React, { useEffect, useLayoutEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [state, setState] = useState("hello world")

  useEffect(() => {
    let i = 0;
    while(i <= 100000000) {
      i++;
    };
    setState("world hello");
  }, []);

  // useLayoutEffect(() => {
  //   let i = 0;
  //   while(i <= 100000000) {
  //     i++;
  //   };
  //   setState("world hello");
  // }, []);

  return (
    <>
      <div>{state}</div>
    </>
  );
}

export default App;
```

### 总结

* 优先使用 useEffect，因为它是异步执行的，不会阻塞渲染

* 会影响到渲染的操作尽量放到 useLayoutEffect中去，避免出现闪烁问题

* useLayoutEffect 和 componentDidMount 是`等价`的，会`同步调用，阻塞渲染`

* 在服务端渲染的时候使用会有一个 warning，因为它可能导致首屏实际内容和服务端渲染出来的内容不一致。

###

* [useLayoutEffect和useEffect的区别](https://zhuanlan.zhihu.com/p/348701319)
* [uselayouteffect](https://reactjs.org/docs/hooks-reference.html#uselayouteffect)
