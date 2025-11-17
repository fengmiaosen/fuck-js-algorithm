# RESTful 接口设计经典准则

## 核心原则

- 资源优先：路径用名词表示资源，如`/users`、`/orders`
- 统一语义：使用标准 HTTP 方法表达意图：`GET`查、`POST`新建、`PUT`全量、`PATCH`局部、`DELETE`删除
- 无状态交互：服务不保存会话，认证与上下文通过每次请求携带（`Authorization`、`Cookie`）
- 可演进性：接口向后兼容，新增字段不破坏旧客户端；采用内容协商或版本策略

## URL 与资源建模

- 分层结构：父子关系用子资源表示，如`/users/{id}/orders`
- 标识清晰：资源 ID 稳定唯一，推荐 UUID；避免在路径中暴露实现细节
- 命名规范：路径使用复数与短横线，保持一致性，如`/user-profiles`或`/users`
- 动作位置：动作类操作放到资源末端或控制器资源，如`/orders/{id}/cancel`

## HTTP 方法语义

- `GET /resources`查询列表，`GET /resources/{id}`查询单体，幂等
- `POST /resources`创建资源，返回`201 Created`并设置`Location: /resources/{id}`
- `PUT /resources/{id}`全量替换（覆盖缺失字段），幂等
- `PATCH /resources/{id}`局部更新（只包含变更字段）
- `DELETE /resources/{id}`删除，成功返回`204 No Content`
- 长耗时异步操作返回`202 Accepted`，并提供任务资源`/jobs/{id}`用于查询进度

## 状态码使用

- 成功类：`200 OK`（查询/更新）、`201 Created`（创建）、`204 No Content`（删除/无返回体）
- 客户端错误：`400 Bad Request`（通用校验）、`401 Unauthorized`、`403 Forbidden`、`404 Not Found`
- 语义细化：`409 Conflict`（并发/冲突）、`410 Gone`（已删除）、`412 Precondition Failed`（条件头失败）、`415 Unsupported Media Type`、`422 Unprocessable Entity`（业务校验失败）
- 服务器错误：`500 Internal Server Error`、`503 Service Unavailable`（配合`Retry-After`）

## 错误响应规范

- 统一错误包：`{ code, message, details?, traceId? }`，`code`为稳定可文档化的业务错误码
- 字段级校验：在`details`中返回字段错误数组（字段、原因、期望）
- 可定位：通过`traceId`或`X-Correlation-Id`串联日志与调用链

```json
{
  "code": "USER_EMAIL_INVALID",
  "message": "email format is invalid",
  "details": [
    { "field": "email", "reason": "format", "expected": "RFC 5322" }
  ],
  "traceId": "c2b3f4..."
}
```

## 过滤、分页与排序

- 分页参数：`page`、`pageSize`或`limit`、`offset`，返回总数与分页信息
- 链接头：使用`Link`头包含`rel="next"`, `rel="prev"`等导航
- 过滤与范围：`?status=active&createdAt[gte]=2025-01-01&createdAt[lte]=2025-01-31`
- 排序与字段选择：`?sort=-createdAt,name&fields=id,name,createdAt`
- 关联展开：`?expand=owner,items`控制内嵌资源

示例 `Link` 头：

```
Link: <https://api.example.com/users?page=3&pageSize=20>; rel="next",
      <https://api.example.com/users?page=1&pageSize=20>; rel="prev"
```

## 内容协商与版本

- 媒体类型：`Content-Type`与`Accept`统一使用 JSON：`application/json; charset=utf-8`
- 版本策略：优先头版本（`Accept: application/vnd.example+json;version=2`），次选路径版本（`/v2/...`）；明确弃用窗口与迁移指南
- 时间与数值：统一 ISO 8601/RFC 3339 时间、UTC 时区；货币等精确数值用字符串或定点小数

## 幂等与并发控制

- 幂等性：`PUT`/`DELETE`天然幂等；对`POST`支持`Idempotency-Key`避免重复创建
- 乐观并发：使用`ETag`/`If-Match`进行条件更新，避免覆盖他人变更
- 缓存协商：`ETag`/`If-None-Match`与`Cache-Control`/`Expires`优化读取

示例条件更新：

```
PUT /users/123
If-Match: "etag-value"
Content-Type: application/json

{ "name": "Alice" }
```

## 可发现性与链接

- 超媒体链接：在响应中提供`links`到相关操作资源（自链接、父资源、下一步操作）
- 元数据：列表响应包含`count`、`page`、`pageSize`、`links`

## 安全与治理

- 全面 TLS，加固`CORS`策略与来源校验
- 认证授权：OAuth2/OIDC 或签名鉴权；细粒度权限与资源级访问控制
- 限流与配额：返回`429 Too Many Requests`并携带`RateLimit-*`头（`RateLimit-Limit`、`RateLimit-Remaining`、`RateLimit-Reset`）
- 隐私与合规：敏感信息脱敏，不在错误中泄露栈信息或内部实现

## 一致性约定

- 字段命名：JSON 使用`camelCase`，保持跨接口一致
- 布尔与枚举：枚举稳定、可文档化；布尔语义明确避免多义
- 空值策略：区分缺失与空值；避免用空字符串代表缺失
- 批量操作：提供`POST /resources/batch`，返回逐项结果与失败原因

## 文档与可测试性

- 规范化描述：维护 OpenAPI/Swagger，生成 SDK 与文档
- 示例与契约测试：提供请求/响应示例、边界条件；通过契约测试确保演进不破坏客户端
- 监控可观测：埋点状态码分布、错误码分布、延迟、超时与重试

## 异步与任务管理

- 异步工作流：创建任务资源`/jobs/{id}`，暴露状态、进度与结果链接
- 回调与事件：可选 webhook 或事件流（SSE/WebSocket），签名校验与重试策略