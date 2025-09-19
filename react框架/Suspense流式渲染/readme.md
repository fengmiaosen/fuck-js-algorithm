前端面试：详细解释React中Suspense原理
大家在面试时，可以从下面3点来回答：
第一，要能说明白Suspense 的目的是解决异步组件或数据加载时的 UI 占位问题，避免白屏。
第二，要能说明白底层机制
第三，要能说明白恢复逻辑
	
接下来，我给大家一个示范回答：
	
面试官您好，Suspense 的原理可以概括为基于 React Fiber 的“挂起、占位和恢复”流程，用来优雅处理异步加载。
在 React 的渲染过程中，如果一个组件需要异步数据，比如用 React.lazy 动态加载组件，或在现代 React 的并发 Server Components 或实验中用 use() 读取 thenable 时，这个组件在执行时会抛出一个 thenable，这是一个带 .then 的 Promise对象。
Fiber 渲染器捕获到这个 thenable 后，就会中断当前 Fiber 的渲染，把它标记为 “挂起状态”。接着 React 会不断向上回溯，找到离它最近的 Suspense 边界，渲染里面的 fallback，也就是我们看到的 loading 占位。
当资源 resolve 时，会触发一次重试调度：调度器按照 lanes 优先级把之前挂起的 Fiber 放回更新队列；如果依赖已就绪，就用真实 UI 替换掉 fallback。
在源码层面，React 会把这个 Promise 存进一个 wakeable 列表，并通过 attachPingListener 给它加上回调。等到这个 Promise resolve 的时候，会触发 retrySuspendedBoundary，把挂起的 Fiber 节点重新放回更新队列。
下一次调度执行时，如果数据已经准备好了，Fiber 就能顺利完成渲染，fallback 会被替换成真实内容。
所以总结一句话：Suspense 的原理就是利用 Fiber 的可中断渲染 + thenable 捕获/唤醒机制，当组件渲染遇到异步时，通过抛 Promise 挂起渲染，等 Promise resolve 后再恢复渲染，期间显示 fallback 来占位 UI。
