

1. 热更新HMR原理

关于webpack的热更新原理，面试官比较想听到的是工作流程和关键点，非“流水账”式的源码分析。我认为可以这样的介绍：

首先，介绍webpack-dev-server:
webpack-dev-server 主要包含了三个部分：
1.webpack: 负责编译代码
2.webpack-dev-middleware: 主要负责构建内存文件系统，把webpack的 OutputFileSystem 替换成 InMemoryFileSystem。同时作为Express的中间件拦截请求，从内存文件系统中把结果拿出来。
3.express：负责搭建请求路由服务。

其次，介绍工作流程:
1.启动dev-server，webpack开始构建，在编译期间会向 entry 文件注入热更新代码；
2.Client 首次打开后，Server 和 Client 基于Socket建立通讯渠道；
3.修改文件，Server 端监听文件发送变动，webpack开始编译，直到编译完成会触发"Done"事件；
4.Server通过socket 发送消息告知 Client；
5.Client根据Server的消息（hash值和state状态），通过ajax请求获取 Server 的manifest描述文件；
6.Client对比当前 modules tree ，再次发请求到 Server 端获取新的JS模块；
7.Client获取到新的JS模块后，会更新 modules tree并替换掉现有的模块；
8.最后调用 module.hot.accept() 完成热更新；

2. Module Federation原理

1. 基本概念
Host（宿主应用）: 消费其他应用模块的应用
Remote（远程应用）: 暴露模块给其他应用使用的应用
Shared（共享依赖）: 多个应用共享的依赖包
2. 核心机制
容器化架构：
每个应用都被包装成一个独立的容器
容器间可以相互暴露和消费模块
通过 remoteEntry.js 文件作为模块入口

```
// Remote 暴露模块
exposes: {
  './Button': './src/Button'
}

// Host 消费模块  
remotes: {
  remote: 'remote@http://localhost:3001/remoteEntry.js'
}
```

3. 工作流程
Host 应用启动 → 加载 Remote 的 remoteEntry.js
获取模块清单 → 了解 Remote 暴露了哪些模块
按需加载 → 动态加载需要的远程模块
依赖共享 → 检查并复用共享依赖（如 React）
模块执行 → 在 Host 环境中运行远程模块
4. 关键优势
独立部署: 各应用可独立开发、构建、部署
运行时集成: 在浏览器运行时动态加载模块
依赖共享: 避免重复加载相同的依赖包
技术栈无关: 不同应用可使用不同的技术栈
5. 应用场景
微前端架构: 多个独立应用组合成一个大应用
大型系统: 复杂业务系统的模块化拆分
团队协作: 不同团队独立开发不同模块
本质: Module Federation 通过容器化 + 动态模块加载 + 依赖共享，实现了应用间的松耦合集成，是现代微前端架构的核心技术。


### 参考资料

* [微前端与webpack 5 Module Federation](https://juejin.cn/post/7051086216594194462)
* [Module Federation](https://webpack.js.org/concepts/module-federation/)
* [一文看透 Module Federation](https://mp.weixin.qq.com/s?__biz=Mzg4MjE5OTI4Mw==&mid=2247491129&idx=1&sn=9bc933947f922b215872abde9c42be6d&scene=21#wechat_redirect)