
状态组件主要通过 3 个生命周期阶段来管理，分别是 装载阶段（MOUNTING），更新阶段（UPDATING）和卸载阶段（UNMOUNT）。

从纵向划分，可以划分为 Render 阶段和 Commit 阶段。

Render 阶段：纯净且不包含副作用，可能会被 React 暂停、中止或重新启动
Commit 阶段：可以使用 DOM，运行副作用，安排更新
更清晰了解生命周期的阶段图表 React Lifecycle Methods Diagram



* [react-lifecycle-methods-diagram](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)