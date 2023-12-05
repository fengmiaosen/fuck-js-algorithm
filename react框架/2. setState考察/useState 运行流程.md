
useState 运行流程
上面介绍了 useState（useReducer）在 mount 阶段、 update 阶段分别做的事情以及组件何时触发组件更新，现在来总结一下 useState 整体的运行流程：
组件初次渲染（挂载）时
此时是第一次执行 useState，也就是 mount 阶段，所以执行的是 mountState。

在 Hook 链表上添加该 useState 的 Hook 节点
初始化 state 的值
返回此次渲染的 state 和 修改 state 的方法

当调用 setXxx/dispatchAction 时

创建 update 对象，并将 update 对象添加到该 Hook 节点的更新队列链表；
判断传入的值（action）和当前正在屏幕上渲染的 state 值是否相同，若相同则略过，若不相同，则调用 scheduleWork 安排组件的重新渲染；
当前所有 setXxx 都逐一执行完后，假如其中能满足（2）的条件，即有调用 scheduleWork 的话，则触发更新（组件重新渲染），进入 Update 阶段；

组件重新渲染（更新）时
组件重新渲染，进入 Update 阶段，即第 2 、第 3 、... n 次执行 useState：

获取该 useState Hook 的更新队列链表；
遍历这个更新队列链表，从最早的那一个 update 对象进行遍历，直至遍历到最近的添加那一个 update 对象，最后得到最新的 state 并返回，作为组件此次渲染的 state；
返回此次渲染的 state 和 修改 state 的方法



作者：前端烧烤摊
链接：https://juejin.cn/post/6867745889184972814
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。


* https://juejin.cn/post/6867745889184972814