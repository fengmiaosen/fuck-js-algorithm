# 前端监控与录屏回放技术提纲

## 掘金文章核心内容提炼

### 一、为什么要做前端监控

- **更快的发现问题和解决问题**
- **做产品的决策依据**
- **为业务扩展提供了更多可能性**
- **提升前端工程师的技术深度和广度，打造简历亮点**

### 二、前端监控目标

#### 2.1 稳定性 (Stability)
- **JS错误**：JS执行错误、Promise异常
- **资源错误**：JS、CSS资源加载异常
- **接口错误**：Ajax、Fetch请求接口异常
- **白屏**：页面空白

#### 2.2 用户体验 (Experience)
- 页面加载时间
- 性能指标监控
- 卡顿检测

#### 2.3 业务 (Business)
- **PV**：页面浏览量和点击量
- **UV**：访问某个站点的不同IP的人数
- **用户停留时间**：用户在每一个页面的停留时间

### 三、前端监控流程

1. **前端埋点**
2. **数据上报**
3. **加工汇总**
4. **可视化展示**
5. **监控报警**

### 四、常见的埋点方案

#### 4.1 代码埋点
- **实现方式**：嵌入代码的形式
- **优点**：精确（任意时刻，数据量全面）
- **缺点**：代码工作量大

#### 4.2 可视化埋点
- **实现方式**：通过可视化交互的手段，代替代码埋点
- **核心思想**：将业务代码和埋点代码分离，提供可视化交互页面
- **优势**：用系统来代替手工插入埋点代码

#### 4.3 无痕埋点
- **实现方式**：前端的任意一个事件被绑定一个标识，所有的事件都被记录下来
- **优点**：采集全量数据，不会出现漏埋和误埋等现象
- **缺点**：给数据传输和服务器增加压力，也无法灵活定制数据结构

### 五、错误监控数据结构

#### 5.1 JS错误数据结构
```javascript
{
    "title": "前端监控系统", // 页面标题
    "url": "http://localhost:8080/", // 页面URL
    "timestamp": "1590815288710", // 访问时间戳
    "userAgent": "Chrome", // 用户浏览器类型
    "kind": "stability", // 大类
    "type": "error", // 小类
    "errorType": "jsError", // 错误类型
    "message": "Uncaught TypeError: Cannot set property 'error' of undefined", // 类型详情
    "filename": "http://localhost:8080/", // 访问的文件名
    "position": "0:0", // 行列信息
    "stack": "btnClick (http://localhost:8080/:20:39)^HTMLInputElement.onclick (http://localhost:8080/:14:72)", // 堆栈信息
    "selector": "HTML BODY #container .content INPUT" // 选择器
}
```

#### 5.2 Promise错误数据结构
```javascript
{
    // ...基础字段
    "errorType": "promiseError", // 错误类型
    "message": "someVar is not defined", // 类型详情
    "stack": "http://localhost:8080/:24:29^new Promise (<anonymous>)^btnPromiseClick (http://localhost:8080/:23:13)^HTMLInputElement.onclick (http://localhost:8080/:15:86)", // 堆栈信息
    "selector": "HTML BODY #container .content INPUT" // 选择器
}
```

#### 5.3 资源错误数据结构
```javascript
{
    // ...基础字段
    "errorType": "resourceError", // 错误类型
    "filename": "http://localhost:8080/error.js", // 访问的文件名
    "tagName": "SCRIPT", // 标签名
    "timeStamp": "76" // 时间
}
```

### 六、错误监控实现方案

#### 6.1 资源加载错误 + JS执行错误监听
```javascript
// 一般JS运行时错误使用window.onerror捕获处理
window.addEventListener(
  "error",
  function (event) {
    let lastEvent = getLastEvent();
    // 有 e.target.src(href) 的认定为资源加载错误
    if (event.target && (event.target.src || event.target.href)) {
      tracker.send({
        // 资源加载错误
        kind: "stability", // 稳定性指标
        type: "error", // resource
        errorType: "resourceError",
        filename: event.target.src || event.target.href, // 加载失败的资源
        tagName: event.target.tagName, // 标签名
        timeStamp: formatTime(event.timeStamp), // 时间
        selector: getSelector(event.path || event.target), // 选择器
      });
    } else {
      tracker.send({
        kind: "stability", // 稳定性指标
        type: "error", // error
        errorType: "jsError", // jsError
        message: event.message, // 报错信息
        filename: event.filename, // 报错链接
        position: (event.lineNo || 0) + ":" + (event.columnNo || 0), // 行列号
        stack: getLines(event.error.stack), // 错误堆栈
        selector: lastEvent
          ? getSelector(lastEvent.path || lastEvent.target)
          : "", // CSS选择器
      });
    }
  },
  true
); // true代表在捕获阶段调用
```

#### 6.2 Promise异常监听
```javascript
// 当Promise 被 reject 且没有 reject 处理器的时候，会触发 unhandledrejection 事件
window.addEventListener(
  "unhandledrejection",
  function (event) {
    // Promise异常处理逻辑
  }
);
```

---

## 一、前端监控概述

### 1.1 监控目的
- 获取用户行为数据
- 跟踪产品在用户端的使用情况
- 以监控数据为基础指明产品优化方向

### 1.2 监控分类
- **性能监控** - 衡量前端性能指标（时间维度）
- **异常监控** - 监控JS错误、API请求失败等
- **数据监控** - 用户行为数据采集

## 二、数据采集方案

### 2.1 页面埋点
- **手写埋点**：自主选择监控数据，灵活性大但工作量大
- **无埋点**：统计所有事件并定时上报，需后期过滤数据

### 2.2 监控数据类型
- PV/UV 统计
- 停留时长
- 流量来源
- 用户交互行为
- 页面性能指标
- 错误信息收集

## 三、性能监控

### 3.1 核心API
- `window.performance` API
- 页面加载时间监测
- 资源加载性能分析

### 3.2 监控指标
- 页面打开速度
- 首屏渲染时间
- 资源加载时间
- 用户交互响应时间

## 四、异常监控

### 4.1 错误类型
- JavaScript运行时错误
- 资源加载错误
- API请求错误
- 白屏检测

### 4.2 错误信息收集
```javascript
{
  "title": "前端监控系统",
  "url": "页面URL",
  "timestamp": "时间戳",
  "userAgent": "浏览器信息",
  "kind": "stability",
  "type": "error",
  "errorType": "jsError",
  "message": "错误信息",
  "filename": "文件名",
  "position": "行列信息",
  "stack": "堆栈信息",
  "selector": "选择器"
}
```

## 五、录屏回放系统 

例如：rrweb 是一个基于 Web 技术的前端监控和录屏回放系统，它可以记录用户在浏览器中的操作行为，包括点击、滚动、输入等，同时也可以回放这些操作行为。

### 5.1 技术实现
- DOM快照记录
- 用户操作事件捕获
- 页面变化增量记录
- 时间轴同步机制

### 5.2 核心功能
- 用户操作路径追踪
- 页面状态回放
- 错误场景重现
- 用户行为分析

## 六、数据上报

### 6.1 上报策略
- 实时上报
- 批量上报
- 本地缓存机制
- 网络异常处理

### 6.2 数据格式
- 统一的数据结构
- 压缩传输
- 加密处理
- 去重机制

## 七、监控平台架构

### 7.1 前端技术栈
- Angular/React/Vue等现代框架
- 图表可视化库
- 实时数据展示

### 7.2 后端技术栈
- Node.js + Express
- 数据库：MongoDB/MySQL
- 消息队列处理
- 数据分析引擎

### 7.3 核心功能
- 多站点监控管理
- 多维度数据统计
- 自定义查询时间
- 图表展示
- 阈值告警
- 邮件通知

## 八、关键技术点

### 8.1 Web API应用
- Performance API
- MutationObserver
- IntersectionObserver
- RequestIdleCallback

### 8.2 数据处理
- 数据采集优化
- 存储压缩
- 实时计算
- 离线分析

### 8.3 用户体验
- 低侵入性采集
- 异步处理
- 错误边界处理
- 性能影响最小化

---

*参考资料：*
- [如何实现一个前端监控回放系统](https://hijiangtao.github.io/2021/01/25/Web-Record-and-Replay/)
- [前端监控体系搭建](https://cloud.tencent.com/developer/article/1983779)
- [前端监控全解析](https://blog.csdn.net/wang_yu_shun/article/details/110790205)