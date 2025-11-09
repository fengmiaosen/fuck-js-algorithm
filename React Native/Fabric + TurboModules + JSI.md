
## 新架构（Fabric + TurboModules + JSI）

从 React Native 0.68 开始，新架构逐步稳定并默认开启。它的目标是解决旧 Bridge 的瓶颈问题，核心是 JavaScript Interface (JSI)。

1. JavaScript Interface (JSI) - 基石

JSI 是革命性的改变。它移除了旧的异步消息队列桥接机制。

· 核心能力：JSI 是一个轻量级的、通用的层，用 C++ 编写，它让 JavaScript 对象（在 JS 引擎中）可以直接持有和调用 C++ 对象（在原生的内存空间中）的引用。
· 打破隔离：这意味着 JavaScript 和原生代码现在可以同步通信，无需序列化。JavaScript 可以直接调用原生方法，反之亦然。
· 引擎无关：JSI 是抽象层，不依赖特定的 JS 引擎（如 JavaScriptCore）。这使得在未来使用 V8、Hermes 等引擎成为可能。Hermes 就是为新架构而优化的引擎。

2. Fabric - 新的渲染系统

Fabric 是建立在 JSI 之上的新 UI 架构。

· 同步渲染：由于 JSI 的存在，当 JavaScript 线程计算好新的视图树后，它可以同步地通知原生 UI 线程去创建和更新视图。跳过了旧架构中异步序列化和阴影线程计算的部分步骤。
· 减少序列化：数据不再需要被序列化为 JSON，大大减少了通信开销。
· 优先级和并发：Fabric 支持渲染中断和优先级调度，为 React 18 的并发特性（如 Suspense）提供了原生支持。

3. TurboModules - 新的原生模块系统

TurboModules 是旧原生模块系统的升级。

· 延迟加载：原生模块不再是应用启动时就全部初始化并注入 JavaScript。它们只在 JavaScript 端真正需要调用时才被初始化，加快了启动速度。
· 强类型：使用代码生成（通过 Codegen）来确保 JavaScript 和原生端类型定义的一致性，减少了运行时错误。
· 直接调用：得益于 JSI，JavaScript 可以直接调用 TurboModules 的原生方法，无需经过 Bridge 的序列化过程。