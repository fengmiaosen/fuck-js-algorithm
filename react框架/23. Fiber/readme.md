### ReactElement, Fiber, DOM 三者的关系
在React 应用中的高频对象一文中, 已经介绍了ReactElement和Fiber对象的数据结构. 这里我们梳理出ReactElement, Fiber, DOM这 3 种对象的关系

ReactElement 对象(type 定义在shared 包中)

所有采用jsx语法书写的节点, 都会被编译器转换, 最终会以React.createElement(...)的方式, 创建出来一个与之对应的ReactElement对象
fiber 对象(type 类型的定义在ReactInternalTypes.js中)

fiber对象是通过ReactElement对象进行创建的, 多个fiber对象构成了一棵fiber树, fiber树是构造DOM树的数据模型, fiber树的任何改动, 最后都体现到DOM树.

DOM 对象: 文档对象模型

DOM将文档解析为一个由节点和对象（包含属性和方法的对象）组成的结构集合, 也就是常说的DOM树.

JavaScript可以访问和操作存储在 DOM 中的内容, 也就是操作DOM对象, 进而触发 UI 渲染.
它们之间的关系反映了我们书写的 JSX 代码到 DOM 节点的转换过程:



注意:

开发人员能够控制的是JSX, 也就是ReactElement对象.

fiber树是通过ReactElement生成的, 如果脱离了ReactElement,fiber树也无从谈起. 所以是ReactElement树(不是严格的树结构, 为了方便也称为树)驱动fiber树.

fiber树是DOM树的数据模型, fiber树驱动DOM树

开发人员通过编程只能控制ReactElement树的结构, ReactElement树驱动fiber树, fiber树再驱动DOM树, 最后展现到页面上. 所以fiber树的构造过程, 实际上就是ReactElement对象到fiber对象的转换过程.


### virtual dom

阅读了这篇文章An Introduction to React Fiber - The Algorithm Behind React。
学习Fiber之前建议先学习Virtual DOM，Fiber是对Virtual DOM的一种升级。

Virtual DOM使用栈来调度需要更新的内容，中间无法中断、暂停。

Fiber支持中断，在浏览器渲染帧里面分片执行更新任务。
Fiber结构让虚拟节点记录父节点、兄弟节点、子节点，形成**链表树**，你可以从任意顶点遍历到任意子节点，并返回。
Fiber的分片操作使用requestAnimationFrame(高优先级任务)和requestIdleCallback(低优先级任务)
Fiber对任务的执行优先级进行标记，高优先级的任务可以先执行，实现架构上的无阻塞

作者：WanderHuang
链接：https://juejin.cn/post/6989558353160585246
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

### doc

* [图解React原理](https://7km.top/main/fibertree-prepare)
* [前端大佬谈 React Fiber 架构](https://zhuanlan.zhihu.com/p/137234573)
* [https://juejin.cn/post/7278305453599096893](https://juejin.cn/post/7278305453599096893)