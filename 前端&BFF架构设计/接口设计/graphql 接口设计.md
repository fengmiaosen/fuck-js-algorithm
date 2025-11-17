# GraphQL 接口设计经典准则

## 概念简介

- GraphQL 是用于构建 API 的查询语言和运行时。客户端声明需要哪些数据，服务端按需返回同样结构的结果，通常通过一个统一端点提供。
- 核心组成：
  - Schema 与类型系统：用 SDL 定义业务类型、字段与关系，形成强类型契约。
  - 操作类型：Query（查询）、Mutation（变更）、Subscription（订阅）。
  - 解析器（Resolver）：为字段提供取数逻辑，连接数据库与下游服务。
  - 变量与指令：通过变量传参；使用指令如 `@include`/`@skip`，可选 `@defer`/`@stream` 进行分片或流式传输。
- 响应约定：成功数据位于 `data`，业务错误位于 `errors`，诊断信息放在 `errors[*].extensions`。
- 与 REST 对比：避免过度/不足取数、强类型自描述、前端可组合；但缓存与网关治理需额外策略（APQ、复杂度/深度限制）。
- 适用场景：复杂页面需要跨资源组合、移动端带宽敏感、多个后端聚合的 BFF 层。

示例查询与响应：

```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    orders(first: 2) {
      edges { node { id total } }
      pageInfo { hasNextPage endCursor }
    }
  }
}
```

```json
{
  "data": {
    "user": {
      "id": "u1",
      "name": "Alice",
      "orders": {
        "edges": [ { "node": { "id": "o1", "total": 199.0 } } ],
        "pageInfo": { "hasNextPage": true, "endCursor": "cursor-2" }
      }
    }
  }
}
```

## 核心原则

- 模型优先：以业务域建模 Schema，先定义类型与关系，再实现解析器
- 最小可用：用例驱动字段设计，避免一次性暴露过多查询深度
- 可演进：通过弃用与新增维持向后兼容，避免破坏性变更
- 明确边界：把鉴权、缓存、复杂度控制放在网关或 BFF 层统一治理

## 命名与类型

- 一致命名：类型用 PascalCase（`User`），字段用 camelCase（`createdAt`）
- ID 规范：统一 `ID!`，全局唯一；建议实现 `Node` 接口与根字段 `node(id: ID!)`
- 非空策略：常用标量默认非空（`String!`、`Int!`），用可空表达缺失或异常
- 输入与输出分离：`input` 类型仅用于变更，避免重用输出类型
- 自定义标量：时间用 `DateTime`（ISO 8601）、货币用 `Decimal` 或 `Money` 复合类型

## 查询与变更

- 查询只读：不产生副作用；按业务聚合暴露枝叶而非数据库表
- 变更语义化：每个变更一个动作，返回 Payload（含目标对象与元信息）
- 批量变更：提供明确批量接口，返回逐项结果与失败原因
- 幂等保障：对可能重复的变更支持 `clientMutationId` 或服务端幂等键

## 分页与筛选

- 游标优先：采用 Relay Connection 规范（`edges/node/pageInfo{hasNextPage,endCursor}`）
- 统一参数：`first/after`（向前）、`last/before`（向后），限制最大页大小
- 过滤与排序：使用输入对象如 `filter`、`orderBy`，避免散列参数
- 结果稳定：排序缺省明确，游标不可破解底层实现

```graphql
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}
type UserEdge { cursor: String!, node: User! }
type PageInfo { hasNextPage: Boolean!, hasPreviousPage: Boolean!, startCursor: String, endCursor: String }
```

## 错误与返回体

- GraphQL 约定：业务错误放在 `errors` 数组，`data` 可为部分成功
- 结构化错误：在 `extensions` 中携带稳定错误码与可诊断信息
- 传输码：网络或鉴权失败用 HTTP 非 200；业务失败仍返回 200 + `errors`

```json
{
  "data": null,
  "errors": [
    {
      "message": "email invalid",
      "path": ["createUser","email"],
      "extensions": { "code": "USER_EMAIL_INVALID", "traceId": "c2b3f4" }
    }
  ]
}
```

## 鉴权与安全

- 统一入口：在网关/BFF统一鉴权，解析器内进行资源级细粒度检查
- 字段级控制：在解析器中检查权限，不在 SDL 中泄漏内部安全细节
- 查询治理：开启复杂度与深度限制、速率限制、查询白名单或持久化查询（APQ）
- 内省控制：生产环境限制内省或仅对受信客户端开放

## 性能与 N+1

- 批处理与缓存：为每个数据源使用 DataLoader 做按键批量查询与短缓存
- 层次缓存：对可缓存查询启用结果缓存或字段缓存，明确失效策略
- 语句优化：避免解析器中循环查询；把聚合改为一次批量请求
- Streaming：在支持的栈上谨慎使用 `@defer`/`@stream` 提升首屏体验

## 演进与弃用

- 非破坏演进：新增类型/字段不破坏旧客户端；避免删除或重命名
- 弃用声明：使用 `@deprecated(reason: "...")` 标注旧字段，并设定迁移窗口
- 合约测试：为关键查询/变更建立契约测试，防止回归

## 跨团队与微服务

- 架构选择：单体 Schema 适合中小团队，联邦（Apollo Federation）适合多域协作
- 边界清晰：在联邦中用 `@key` 标识可合并实体，避免跨域泄漏内部关系
- 网关策略：统一路由、鉴权、复杂度限制与可观测性在网关层实现

## 可观测性

- 关联 ID：通过请求头携带 `X-Correlation-Id` 并在 `extensions` 回传
- 指标采集：记录解析器耗时、错误码分布、查询复杂度、缓存命中率
- 日志与追踪：按字段/解析器维度打点，接入分布式追踪

## HTTP 与缓存

- 传输约定：默认 `POST`；对持久化查询或短查询支持 `GET` 以便 CDN 缓存
- 持久化查询：使用 APQ（Automatic Persisted Queries）减少体积并提升缓存命中
- CDN 策略：依据查询哈希与变量构建缓存键；对私有数据禁用或短 TTL

## 文件与订阅

- 上传：遵循 GraphQL multipart 请求规范，字段使用 `Upload`
- 实时：订阅采用 WebSocket/SSE，明确鉴权与重连策略；推送仅限必要事件

## 示例片段（Schema 与变更）

```graphql
scalar DateTime

interface Node { id: ID! }

type User implements Node { id: ID!, email: String!, name: String!, createdAt: DateTime! }

type Query {
  node(id: ID!): Node
  users(first: Int, after: String, filter: UserFilter, orderBy: UserOrder): UserConnection!
}

input UserFilter { email: String, createdAtFrom: DateTime, createdAtTo: DateTime }
input UserOrder { field: UserOrderField!, direction: OrderDirection! }
enum UserOrderField { CREATED_AT, NAME }
enum OrderDirection { ASC, DESC }

type Mutation {
  createUser(input: CreateUserInput!): CreateUserPayload!
}

input CreateUserInput { email: String!, name: String!, clientMutationId: String }
type CreateUserPayload { user: User, clientMutationId: String }
```

## 落地建议

- 以用例为单位迭代 Schema，优先实现分页查询与核心变更
- 引入 DataLoader 与复杂度/深度限制，先消除 N+1 与过度查询
- 建立错误码与 `extensions.code` 规范、字段弃用流程与契约测试
- 选择单体或联邦并确定网关治理策略，统一鉴权与可观测

## Apollo Federation 最小示例

```graphql
# accounts 子图
type User @key(fields: "id") {
  id: ID!
  email: String!
  name: String
}
```

```graphql
# reviews 子图
type Review { id: ID!, authorId: ID!, body: String!, rating: Int! }

extend type User @key(fields: "id") {
  id: ID! @external
  name: String @external
  reviews(first: Int, after: String): ReviewConnection!
  reviewCount: Int @requires(fields: "name")
}

type ReviewConnection {
  edges: [ReviewEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}
type ReviewEdge { cursor: String!, node: Review! }
```

```graphql
# products 子图（演示 @provides）
scalar Decimal

type Product @key(fields: "sku") { sku: ID!, price: Decimal! }

type OrderItem { productSku: ID!, qty: Int! }

extend type OrderItem {
  product: Product! @provides(fields: "price")
}
```

## 网关治理示例（APQ、复杂度、速率）

- 持久化查询（APQ）：客户端首次发送完整查询注册哈希，后续用哈希 + 变量发起 `GET` 请求以便 CDN 缓存

```
GET /graphql?extensions={"persistedQuery":{"version":1,"sha256Hash":"abc123"}}&variables={"first":10}
Accept: application/json
```

- 复杂度/深度限制：在网关解析 AST，限制最大深度与复杂度（示例：深度 ≤ 10、复杂度 ≤ 200），对超限返回错误码与说明
- 速率限制：针对身份或 IP 应用令牌桶/漏桶，超限返回 `429 Too Many Requests` 并携带 `RateLimit-*` 响应头
- 缓存策略：对公开只读查询启用结果缓存；私有数据禁用或设置短 TTL；结合 APQ 使用 `GET` 以提升 CDN 命中