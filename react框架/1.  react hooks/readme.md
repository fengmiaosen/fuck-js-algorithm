
* [「react进阶」一文吃透react-hooks原理](https://juejin.cn/post/6944863057000529933)
* [React useEffect Hook的对象 & 数组依赖](https://delaprada.com/2021/03/13/React-useEffect-Hook%E7%9A%84%E5%AF%B9%E8%B1%A1-%E6%95%B0%E7%BB%84%E4%BE%9D%E8%B5%96/)
* [以列表页为例，谈React Hooks的逻辑抽象与封装](https://zhuanlan.zhihu.com/p/100683538)

* [react hooks demo](https://codesandbox.io/s/hardcore-framework-c5rtwr?file=/src/hooks.js)

## 「react进阶」一文吃透 React Hooks 原理 — 核心要点

- Hooks 动机：为函数组件提供 state、生命周期与逻辑复用能力（替代部分 class 用法）。
- 函数组件与类组件差异：函数组件每次渲染都是新的函数执行；类组件通过实例在渲染间持久化状态。
- Hooks 状态记录：React 在当前 fiber 上按调用顺序维护 hooks 链；顺序不可变是核心约束。
- 顶层调用规则：不得在条件/循环中调用 hooks，避免破坏“第 n 个 hook 对应第 n 个状态”。
- useState 内部流转：通过 `ReactCurrentDispatcher.current` 的 dispatcher 提供当前值与稳定的 setter。
- useState 与 class setState 区别：前者是替换而非合并；相同值（Object.is）跳过更新；支持函数式更新避免闭包旧值。
- 闭包与异步旧值：定时器等异步回调中读取到旧值，使用 `setX(prev => ...)` 获取最新状态。
- useEffect/useLayoutEffect 时机：前者绘制后异步执行；后者 DOM 变更后绘制前同步执行；依赖数组决定是否复用。
- useMemo/useCallback 缓存：以依赖为键缓存计算结果或函数引用；仅在开销显著且依赖稳定时使用。
- useRef 持久容器：`.current` 在渲染间持久且不触发渲染，读写无需依赖数组，常用于保存实例或前次值。
- Dispatcher 与渲染阶段：挂载/更新阶段使用不同 dispatcher；渲染前绑定、渲染后清理。
- 规范与检查：使用 lint 规则确保依赖完整与调用顺序正确，减少隐性 bug。

### 示例图片（保留）

![hooks 总览示意](https://i-blog.csdnimg.cn/blog_migrate/47ef1a8bbaee3f22f024df5099.jpeg)
![函数/类组件差异示意](https://i-blog.csdnimg.cn/blog_migrate/87295df6c59c89175aa79d67c7a055a6.jpeg)
![setState 行为示意](https://i-blog.csdnimg.cn/blog_migrate/8a9bc08811421132066b290c5d4df96a.jpeg)
![更新队列示意](https://i-blog.csdnimg.cn/blog_migrate/76b50982938781c26adf6ed4567e4f7b.jpeg)
![hooks 链表示意](https://i-blog.csdnimg.cn/blog_migrate/ad1d04eb95c83ee364dcedfb93dfdaf7.jpeg)

原文链接：`https://juejin.cn/post/6944863057000529933`
