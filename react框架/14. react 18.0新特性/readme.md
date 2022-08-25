
### react18 新特性

* Concurrent Mode（并发模式）

`并发模式`可帮助应用保持响应，并根据用户的设备性能和网速进行适当的调整，该模式通过使渲染可中断来修复阻塞渲染限制。在 Concurrent 模式中，React 可以同时更新多个状态

`React 17 和 React 18 的区别就是：从同步不可中断更新变成了异步可中断更新`

`并发特性`指开启`并发模式`后才能使用的特性，比如：

1. useDeferredValue
    返回一个延迟响应的值，可以让一个state 延迟生效，只有当前没有紧急更新时，该值才会变为最新值。useDeferredValue 和 startTransition 一样，都是标记了一次非紧急更新

2. useTransition
    ，主要为了能在大量的任务下也能保持 UI 响应。这个新的 API 可以通过将特定更新标记为“过渡”来显著改善用户交互，简单来说，就是被 startTransition 回调包裹的 setState 触发的渲染被标记为不紧急渲染，这些渲染可能被其他紧急渲染所抢占


useDeferredValue 与 useTransition 差异：

相同：useDeferredValue 本质上和内部实现与 useTransition 一样，都是标记成了延迟更新任务。
不同：useTransition 是把更新任务变成了延迟更新任务，而 useDeferredValue 是产生一个新的值，这个值作为延时状态。（一个用来包装方法，一个用来包装值）

* 自动批量渲染

react 18之前，默认状态下，Promise、setTimeout、原生事件处理程序，或任何 react 内部事件的更新不会在 React 中批处理，而在 React 18 中，这些更新都将可以自动批处理。

```js
// react18之前： 仅会批量处理 react 事件中的
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // react 将会渲染两次，每次状态更新渲染一次
}, 1000);

// 现在 react 自身事件以及其他事件都是批量处理
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React在最后会渲染一次
}, 1000);
```

* Transitions 用来区分紧急和非紧急更新

紧急更新是指在直接交互像是输入、点击和按下等操作;
非紧急更新，则是将 UI 从视图过渡到另一个视图。

打字、点击和按下等紧急更新需要立即回应，对用户来说，如果这些行为没有立刻获得回应，用户会觉得应用程序发生问题，但是并非所有过渡都是相同的，因为用户并不会期望在屏幕增至到每个中间值

```js
import {startTransition} from 'react';

// 用户输入内容
setInputValue(input);

// 标记为非紧急更新
startTransition(() => {
  setSearchQuery(input);
});
```

* Suspense 功能

 React 18 中结合使用 Suspense 与 Transitions API，以获得最佳的效果。Suspense 可以让还没准备好渲染的 UI，显示为加载状态


* 新的客户端和服务端渲染API

createRoot: 用于创建要渲染或者卸载的根的方法

hydrateRoot： 为服务器渲染的应用提供重要方法

### 参考资料
* [React18 新特性](https://zhuanlan.zhihu.com/p/493715909)
* [React 18新功能，新特性！React 18发布！](https://secstep.com/react-18-is-now-available-on-npm/)
* [react 18](https://github.com/facebook/react/blob/main/CHANGELOG.md#1800-march-29-2022)
* [React18 新特性解读 & 完整版升级指南](https://juejin.cn/post/7094037148088664078)