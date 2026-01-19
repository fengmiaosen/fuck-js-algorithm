# 自动化测试概览

## 核心概念
- 单元测试（Unit Test）：针对最小可测试单元（函数、类、组件）进行隔离验证，强调快速、可重复、无外部依赖；常用测试替身（mock、stub、spy）与固定夹具（fixture）。
- 集成测试（Integration Test）：验证模块/组件之间的协作，允许接入真实依赖（数据库、HTTP）或靠近真实环境的替身，关注边界、接口契约与数据流。速度中等、搭建成本较高。
- 端到端测试（E2E Test）：从用户视角覆盖关键业务流程，驱动真实浏览器或完整系统环境，验证 UI、路由、后端、数据库的贯通。价值高但更慢、更易波动，应聚焦高价值路径。
- 测试金字塔：单元测试为多、集成测试适量、E2E 测试少而精，典型比例可参考 70/20/10，避免“冰淇淋锥”（E2E 过多）。
- 关键术语：SUT（被测对象）、Arrange-Act-Assert、Given-When-Then、fixture（测试数据/环境）、test double（mock/stub/fake/spy）、可重复性（determinism）、覆盖率（line/branch/function）。

## 主流测试框架

### 前端（单元/集成）
- `Jest`：成熟生态、JSDOM、快照、内置 mock，通用 JS/TS。
- `Vitest`：与 Vite 深度集成、运行快、兼容 Jest API，现代前端首选。
- `Mocha` + `Chai`：灵活可组装，历史悠久。
- `Testing Library` 系列：`@testing-library/react`/`vue`/`dom`，倡导以用户行为为中心的断言。
- 组件级集成：`Cypress Component Testing`、`Playwright Component Testing`，在真实浏览器中驱动组件。
- 辅助：`sinon`（spy/mock）、`msw`（网络层 mock）。

### 前端（端到端）
- `Playwright`（`@playwright/test`）：跨浏览器（Chromium/Firefox/WebKit）、自动等待、快照与 Trace Viewer、CI 友好，当前主流。
- `Cypress`：优秀的交互式调试与网络桩能力，社区广。
- `WebdriverIO`：基于 WebDriver，适配多平台、与 Selenium 生态兼容。
- `Selenium`/Selenium Grid：经典方案，语言与平台覆盖广。
- 其他：`TestCafe`、`Nightwatch`、`Puppeteer`（更偏自动化库、非完整测试框架）、视觉回归 `Percy`/`Applitools`。

### Node.js 后端（单元/集成）
- 单元：`Vitest`、`Jest`、`Mocha`+`Chai`、`Ava`。
- HTTP 集成：`supertest`（请求/断言）、`nock`/`msw`（HTTP mock）。
- 真实依赖：`Testcontainers`（以容器拉起真实 DB、Kafka 等），提升可信度。
- 契约测试：`Pact`（消费者驱动契约）。
- 进阶：`fast-check`（性质测试/property-based）。

### Java
- 单元：`JUnit 5`、`TestNG`。
- 集成：`Spring Boot Test`、`RestAssured`、`Testcontainers`、`WireMock`。
- E2E：`Selenium`、`Playwright`。

### Python
- 单元：`pytest`、`unittest`。
- 集成：`requests`/`httpx`、Django/Flask TestClient、`Testcontainers`。
- E2E：`Playwright`（Python）、`Selenium`、`Robot Framework`。

### Go
- 单元：标准库 `testing`、`testify`，HTTP `httptest`。
- 集成：`Testcontainers`、数据库/消息队列真容器。
- E2E：`Playwright`（Go 绑定）、`Selenium`。

### .NET
- 单元：`xUnit`、`NUnit`、`MSTest`。
- 集成：ASP.NET Core `WebApplicationFactory`、`WireMock.Net`、`Testcontainers`。
- E2E：`Playwright .NET`、`Selenium`。

### 移动端
- 原生/混合：`Appium`。
- React Native：`Detox`。

## 选型建议
- 现代前端：单元/集成优先选 `Vitest` + `Testing Library`，E2E 选 `Playwright`；需要交互式调试可选 `Cypress`。
- Node API：`Vitest/Jest` + `supertest` 做路由与中间件集成，数据库用 `Testcontainers` 跑真容器，跨服务用 `Pact`。
- Java 与 Python：标准单元框架 + `Testcontainers` 做集成，UI 端到端首选 `Playwright` 或沿用 `Selenium`。
- 选择原则：优先稳定与可维护，E2E 聚焦关键用户路径；组件测试用真实浏览器更贴近用户行为。

## 实践要点
- 测试结构：按层次组织如 `tests/unit`、`tests/integration`、`tests/e2e` 或按特性/模块分组；命名清晰、用例独立。
- 隔离与数据：固定随机性（seed）、冻结时间、使用专用测试数据；E2E 使用可重复的种子或沙盒环境。
- 选择器策略：UI 测试用 `data-testid` 或可访问性选择器（role/name），避免脆弱的 CSS/XPath。
- 等待策略：避免固定 `sleep`，用 Playwright/Cypress 的自动等待和明确的断言。
- 覆盖率与质量：结合 `c8`/`istanbul`（Jest 内置）查看语句/分支覆盖；覆盖率是参考而非唯一目标。
- CI 集成：并行分片、失败重试、产出可视化报告与快照/trace；E2E 放在金字塔顶层、控制总耗时与稳定性。

## 从零开始的最小可行组合
- 单元/集成：`Vitest` + `@testing-library/react|vue` + `jsdom` 或 `happy-dom`。
- 端到端：`@playwright/test`（内含并行、报告、trace、跨浏览器）。