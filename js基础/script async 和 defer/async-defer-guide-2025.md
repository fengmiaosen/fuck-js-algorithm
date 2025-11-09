# `script` 标签的 `async` 与 `defer` 速查与实践（2025 新版）

TL;DR 决策速览：
- `async`：并行下载、下载完成后立即执行、顺序不保证；适合独立第三方脚本（analytics、ads）。
- `defer`：并行下载、HTML 解析完成后按文档顺序执行；适合依赖 DOM/有依赖链的业务脚本。
- `type="module"`：默认类似 `defer`；如需尽早/打破顺序可配 `async`，旧浏览器用 `nomodule` 降级。

---

## 行为对比（简表）
| 维度 | 默认（无属性） | `async` | `defer` |
| --- | --- | --- | --- |
| 解析阻塞 | 阻塞 | 下载不阻塞；执行会打断解析 | 不阻塞；解析完成后执行 |
| 下载方式 | 串行 | 并行 | 并行 |
| 执行时机 | 下载后立刻 | 下载后立刻（任意时刻） | `DOMContentLoaded` 前 |
| 执行顺序 | 按文档顺序 | 取决于下载完成顺序 | 按文档顺序 |
| 典型用途 | 内联小脚本/必须先执行 | 独立第三方脚本 | 站点业务脚本/依赖链 |

注：`async`/`defer` 仅对外链脚本（带 `src`）生效，对内联无效；两者并存时以 `async` 为准。

---

## `async`（Asynchronous）
示例：
```html
<script async src="https://cdn.example.com/analytics.js"></script>
<script async src="https://cdn.example.com/ads.js"></script>
```
优点：
- 非阻塞下载，提升首屏速度。
- 尽早执行，适合监测/广告等独立逻辑。
缺点：
- 执行顺序不保证；有依赖关系时风险高。
- 执行会短暂打断解析，可能影响 INP（Interaction to Next Paint）。
- 执行时 DOM 可能未完整，不适合需要完整 DOM 的操作。
推荐：第三方独立脚本（Analytics/Ads/社交分享按钮等）。

---

## `defer`（Deferred）
示例：
```html
<script defer src="/static/vendor.js"></script>
<script defer src="/static/main.js"></script>
```
优点：
- 非阻塞下载；解析完成后统一执行，稳定可靠。
- 严格按文档顺序执行，天然适合“库→业务”。
- 执行时 DOM 已完整，适合安全 DOM 操作。
缺点：
- 执行相对较晚，不适合必须尽早的逻辑。
推荐：站点自有业务脚本（依赖 DOM/有顺序）。

---

## 现代 `type="module"`
- 外链模块默认不阻塞解析，语义接近 `defer`；依赖加载完成后执行。
- 多个模块通常按文档顺序执行；需尽早/打破顺序时为单个模块加 `async`。
- 旧浏览器降级：
```html
<script type="module" src="/static/app.mjs"></script>
<script nomodule src="/static/legacy.js"></script>
```

---

## 动态插入脚本
多数浏览器中，JS 创建的脚本默认 `async`：
```js
const s = document.createElement('script');
s.src = '/static/chunk.js';
document.head.appendChild(s); // 多数实现下默认 async=true
```
如需顺序执行（类似 `defer`）：
```js
s.async = false;
```

---

## 性能与指标
- `async`/`defer` 改善 FCP/LCP（更快出现可见内容）。
- 大脚本的同步执行会影响 INP/TTI（交互延迟/可用性）。
- 优先减少首屏阶段执行的 JS 体积与同步执行次数。

---

## 最佳实践
- 第三方独立脚本：用 `async`。
- 业务脚本（依赖 DOM/有顺序）：用 `defer`，可置于 `<head>`。
- 模块化应用：优先 `type="module"`；必要时为单个模块加 `async`。
- 关键脚本网络较慢时：`preload` + `defer` 提前加载。
```html
<link rel="preload" as="script" href="/static/main.js">
<script defer src="/static/main.js"></script>
```
- 第三方域名：`preconnect`/`dns-prefetch` 加速建链。
```html
<link rel="preconnect" href="https://cdn.example.com">
<link rel="dns-prefetch" href="//cdn.example.com">
```

---

## 选择清单（Checklist）
1. 独立、无依赖、需尽早？→ 选 `async`。
2. 依赖 DOM/有严格顺序？→ 选 `defer`。
3. 使用模块打包？→ 选 `type="module"`，必要时单个脚本 `async`。
4. 需兼容旧浏览器？→ 配置 `nomodule` 降级。
5. 需更快加载关键脚本？→ `preload` + `defer`。

---

## 简例对照
```html
<!-- 第三方独立脚本（推荐 async） -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA-ID"></script>

<!-- 业务脚本（推荐 defer） -->
<script defer src="/static/vendor.js"></script>
<script defer src="/static/main.js"></script>

<!-- 现代模块脚本（默认类似 defer） -->
<script type="module" src="/static/app.mjs"></script>
<script nomodule src="/static/legacy.js"></script>
```

---

## 一句话总结
- `async`：独立、尽快、顺序不保。
- `defer`：并行下载、解析后按顺序执行、DOM 安全。
- `type="module"`：现代默认选择，可与 `async` 组合按需优化。