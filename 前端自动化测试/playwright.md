# Playwright 测试框架特点

## 核心特点
- 跨浏览器与引擎：同时支持 `Chromium`、`Firefox`、`WebKit`，可覆盖 Chrome/Edge/Safari 类场景。
- 跨平台与 CI 友好：在 `macOS/Windows/Linux` 一致运行，内置浏览器管理，易接入 CI。
- Web-first 自动等待：操作和断言默认智能等待与重试，减少 `wait`/`sleep` 的脆弱用法。
- 稳定选择器体系：`locator` API、`getByRole`、`getByText`、`getByTestId`，更抗改版、可读性更好。
- 上手简单：官方 `@playwright/test` 作为测试运行器，统一配置、断言、并行与报告。

## 测试能力
- 覆盖真实场景：多标签页、多域名跳转、`iframe`、文件上传/下载、弹窗处理。
- 环境仿真：权限、地理位置、时区、颜色主题、离线/网络限速、视口与设备参数。
- 状态复用：`storageState` 复用登录态，`globalSetup` 预登录，端到端测试更高效。
- API 测试：`request.newContext` 直接发 HTTP 请求并断言，前后端联动顺畅。
- 视觉回归：`toHaveScreenshot()` 快速做页面/组件截图对比。

## 运行与并行
- 并发与分片：多 Worker 并行、`--shard=1/3` 分片执行，支持大规模用例线性扩展。
- 重试与隔离：失败重试；`test.describe.configure({ mode: 'serial' | 'parallel' })` 控制隔离策略。
- 多项目配置：通过 `projects` 在同一套件中并行跑不同浏览器、设备、语言/区域设置。

## 调试与可观测性
- UI 模式与断点：`npx playwright test --ui` 交互式调试；配合源码断点定位问题更快。
- Trace/视频/截图：Trace Viewer 记录操作、网络、快照；支持录屏与截图产物。
- 代码生成器：`npx playwright codegen <url>` 录制操作生成可编辑脚本，加速初始用例编写。
- 报告与集成：内置 `html` 报告，兼容 Allure、JUnit；易接入 GitHub Actions、Jenkins 等。

## 生态与语言
- 多语言支持：核心库有 `Node.js/Python/Java/.NET` 版本；官方测试运行器主要是 `Node.js`。
- 组件测试：提供 React/Vue/Svelte 的组件测试能力（视版本为实验或逐步成熟）。

## 与其他框架对比
- 对比 Selenium：更现代的浏览器控制层，支持 `WebKit`，默认自动等待，脚本更稳定更快。
- 对比 Cypress：原生支持多标签/多域名、并行与分片强；浏览器覆盖更广；调试与 Trace 工具成熟。

## 快速上手

```bash
# 初始化项目
npm init playwright@latest

# 安装浏览器依赖
npx playwright install

# 运行测试
npx playwright test

# 交互式调试
npx playwright test --ui

# 打开 Trace 文件
npx playwright show-trace <trace.zip>
```

## 最佳实践建议
- 优先使用 `getByRole`/`getByTestId` 构建稳定选择器，降低样式/文案变更影响。
- 仅对失败用例生成 Trace/视频，兼顾可观测与执行速度。
- 用 `projects` 一次性覆盖多浏览器/设备，结合分片提升 CI 吞吐。
- 复用登录态（`storageState`）与测试夹具（fixtures），减少重复流程，提高端到端效率。