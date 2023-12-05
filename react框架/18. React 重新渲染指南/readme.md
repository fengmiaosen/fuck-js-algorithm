
### React 组件什么时候会重新渲染自己？

组件自身重新渲染有四个原因：状态更改、父（或子）重新渲染、上下文更改和hooks更改

* 状态变化
当组件的状态发生变化时，它会重新渲染自己。通常，它发生在回调或useEffect hooks中。

状态变化是所有重新渲染的“根”源

* 父级重新渲染
如果父组件重新渲染，组件将重新渲染自己。或者，如果我们从相反的方向来看：当一个组件重新渲染时，它也会重新渲染它的所有子组件。
它总是从根向下渲染，子的重新渲染不会触发父的重新渲染。（这里有一些警告和边缘情况，请参阅完整指南了解更多详细信息：React Element、children、parents 和 re-renders 的奥秘）。

* context 变化
当 Context Provider 中的值发生变化时，所有使用此 Context 的组件都将重新渲染，即使它们不直接使用数据变化的部分。这些重新渲染无法通过直接memo来防止，但是有一些可以模拟的变通方法

* hooks变化
hooks内发生的所有事情都“属于”使用它的组件。关于conext和状态变化的相同规则适用于此:

hooks内的状态更改将触发不可避免的宿主重复渲染
如果hooks使用了 Context 并且 Context 的值发生了变化，它会触发一个不可避免的重复渲染

* props的变化（很大的一个误区）
当谈到没有被memo包裹的组件重新渲染，组件的props是否改变并不重要。
为了改变 props，它们需要由父组件更新。这意味着父组件必须重新渲染，这将触发子组件的重新渲染，而不管props是什么。
只有当使用momo技术（React.memo, useMemo）时，props的变化才变得重要

### 参考

* [React 重新渲染指南](https://juejin.cn/post/7129670327725981732)
* [React re-renders guide: everything, all at once](https://www.developerway.com/posts/react-re-renders-guide)