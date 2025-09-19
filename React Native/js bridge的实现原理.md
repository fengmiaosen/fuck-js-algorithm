Bridge（桥接）是 React Native 的核心，它实现了 JavaScript 代码和原生（Native）代码（Java/Objective-C）之间的双向通信。理解 Bridge 是理解 React Native 工作原理的关键。

## 核心思想

Bridge 的核心思想是：在一个独立的、跨平台的 JavaScript 引擎中运行业务逻辑，而原生平台则负责渲染 UI 和处理本地功能，两者通过一个异步的、序列化的、批处理的通信通道进行对话。

你可以把它想象成客户端-服务器（C/S）架构：

· JavaScript 端是“大脑”或“服务器”：它负责运算、决定视图结构和状态、发出指令。
· 原生端是“四肢”或“客户端”：它负责高效地渲染 UI、执行本地操作（如访问文件、GPS）、并将结果返回。
· Bridge 就是它们之间的“网络请求”，负责传递序列化后的消息。

---

## 旧架构（直至版本 0.70 左右）的实现原理

这是最经典、最需要理解的模型。它主要由三个部分组成：

1. JavaScript 层：运行在 JavaScriptCore（JSC）引擎上。
2. 原生层（Native）：运行在 Android（Java/Kotlin）或 iOS（Objective-C/Swift）上。
3. Bridge：连接两者的 C++ 核心层。

其通信过程是异步和序列化的。

1. 通信方式：异步消息队列

JavaScript 和原生代码运行在不同的线程（甚至不同的进程/引擎）中，它们不能直接共享内存或调用彼此的函数。
Bridge 通过消息队列（MessageQueue） 来实现通信。

· 当 JavaScript 需要调用原生模块时，它会将调用信息（模块名、方法名、参数等）放入一个队列中。
· Bridge 会批量地将这些消息序列化为 JSON 字符串。
· 序列化后的消息通过一个桥接器（一种 JNI/FFI 调用） 从 JavaScript 引擎传递到原生环境。
· 原生端接收到消息后，反序列化，找到对应的原生模块和方法，用原生代码执行它。
· 如果需要回调（Callback）或返回结果（Promise），则反向执行同样的过程：原生端将结果数据序列化，通过 Bridge 送回 JavaScript 端。

1. 序列化

所有通过 Bridge 传递的数据都必须能被序列化为 JSON。这意味着你不能传递函数、循环引用对象等复杂类型。函数会被转换成一个唯一的 ID（Callback ID）进行传递。这也是为什么 RN 的通信有一定性能开销的原因。

1. 模块配置

在应用启动时，RN 会通过 Bridge 将原生端所有已注册模块（Native Modules）的元信息（名称、方法、常量等）发送给 JavaScript 端。JavaScript 端会据此生成一个对应的 NativeModules 代理对象。当你调用 NativeModules.FileReader.readFile() 时，实际上是通过这个代理对象将调用信息转发给 Bridge。

1. 三线程模型

为了保持 UI 流畅，RN 默认管理着三个关键的线程：

· JavaScript 线程（JS Thread）：执行 JavaScript 代码、业务逻辑、React 渲染协调（Reconciliation）。setState 等操作在这里发生。
· 原生/UI 线程（Main Thread/UI Thread）：负责原生组件的渲染和用户交互。任何 UI 操作都必须最终在这里执行。
· 阴影线程（Shadow Thread）：专门用于计算由 JavaScript 线程传递过来的布局信息（Flexbox 布局）。它计算好元素的最终位置和大小后，再将结果传递给 UI 线程进行渲染。

一个典型的用户事件流程（以旧架构为例）：

1. 用户点击了一个 <TouchableOpacity>（原生组件）。
2. UI 线程捕获到点击事件。
3. 事件被序列化，通过 Bridge 发送到 JavaScript 线程。
4. JavaScript 线程 执行对应的事件处理函数（例如 onPress）。
5. 处理函数中可能调用 setState，导致 React 进行虚拟 DOM 差异计算（Diffing）。
6. 计算出的布局变更被序列化，通过 Bridge 发送到 阴影线程。
7. 阴影线程 计算新的布局。
8. 布局结果被序列化，通过 Bridge 发送回 UI 线程。
9. UI 线程 根据新的布局信息更新屏幕上的视图。

可以看到，一个简单的交互可能需要在 Bridge 上穿梭多次，这是旧架构性能瓶颈的主要原因。

---

## 新架构（Fabric + TurboModules + JSI）

从 React Native 0.68 开始，新架构逐步稳定并默认开启。它的目标是解决旧 Bridge 的瓶颈问题，核心是 JavaScript Interface (JSI)。

1. JavaScript Interface (JSI) - 基石

JSI 是革命性的改变。它移除了旧的异步消息队列桥接机制。

· 核心能力：JSI 是一个轻量级的、通用的层，用 C++ 编写，它让 JavaScript 对象（在 JS 引擎中）可以直接持有和调用 C++ 对象（在原生的内存空间中）的引用。
· 打破隔离：这意味着 JavaScript 和原生代码现在可以同步通信，无需序列化。JavaScript 可以直接调用原生方法，反之亦然。
· 引擎无关：JSI 是抽象层，不依赖特定的 JS 引擎（如 JavaScriptCore）。这使得在未来使用 V8、Hermes 等引擎成为可能。Hermes 就是为新架构而优化的引擎。

1. Fabric - 新的渲染系统

Fabric 是建立在 JSI 之上的新 UI 架构。

· 同步渲染：由于 JSI 的存在，当 JavaScript 线程计算好新的视图树后，它可以同步地通知原生 UI 线程去创建和更新视图。跳过了旧架构中异步序列化和阴影线程计算的部分步骤。
· 减少序列化：数据不再需要被序列化为 JSON，大大减少了通信开销。
· 优先级和并发：Fabric 支持渲染中断和优先级调度，为 React 18 的并发特性（如 Suspense）提供了原生支持。

1. TurboModules - 新的原生模块系统

TurboModules 是旧原生模块系统的升级。

· 延迟加载：原生模块不再是应用启动时就全部初始化并注入 JavaScript。它们只在 JavaScript 端真正需要调用时才被初始化，加快了启动速度。
· 强类型：使用代码生成（通过 Codegen）来确保 JavaScript 和原生端类型定义的一致性，减少了运行时错误。
· 直接调用：得益于 JSI，JavaScript 可以直接调用 TurboModules 的原生方法，无需经过 Bridge 的序列化过程。

## 总结对比

| 特性 | 旧架构 (Bridge) | 新架构 (JSI) |
|------|----------------|--------------|
| 通信方式 | 异步、序列化（JSON）的消息队列 | 同步、直接的方法调用（无需序列化）|
| 性能 | 较低，有序列化开销和延迟 | 高，极大减少了通信开销 |
| 线程模型 | 严格的三线程，通信必须跨线程 | 更灵活，允许同步调用，线程边界更模糊 |
| 启动速度 | 慢，启动时需要初始化所有原生模块 | 快，TurboModules 支持按需加载 |
| 引擎依赖 | 强依赖 JavaScriptCore | 引擎无关（通过 JSI 抽象）|
| 数据类型 | 只能传递可序列化为 JSON 的数据 | 可以传递更丰富的类型（如函数引用）|

## 结论

React Native 的 JavaScript Bridge 实现原理经历了一次重大的演进：

· 旧架构通过一个异步、序列化的消息队列桥来通信，简单但有效，其性能瓶颈也源于此。
· 新架构通过 JSI 这个抽象层，实现了 JavaScript 和原生代码的直接互操作，彻底重构了通信机制（Fabric）和模块系统（TurboModules），带来了巨大的性能提升和更现代化的开发体验。

对于开发者而言，新架构下大部分代码无需改动，但底层变得更快、更强大。理解这些原理有助于你编写出性能更好的代码，并更好地调试跨语言边界的问题。