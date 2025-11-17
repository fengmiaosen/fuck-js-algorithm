# WebSocket 与 SSE 核心特点与优缺点

## 核心区别

- WebSocket：全双工长连接，客户端与服务端双向实时传输；通过 HTTP Upgrade 建立，消息帧支持文本与二进制。
- Server-Sent Events（SSE）：基于 HTTP 的服务端单向推送，浏览器原生 `EventSource` 支持，使用 `text/event-stream` 文本流，自动重连并支持断点续传。

## WebSocket 优点

- 双向通信，适合即时交互（聊天、协同编辑、在线游戏）。
- 二进制高效，便于传输 `ArrayBuffer`/`Blob`/Protobuf 等。
- 帧开销低、吞吐高，适合高频与海量消息。

## WebSocket 缺点

- 依赖 HTTP Upgrade，部分代理/WAF 不友好；在 HTTP/2 中需 RFC 8441 支持并额外配置。
- 重连与保活需要自行实现：Ping/Pong、断线重连、背压控制（`bufferedAmount`）。
- 水平扩展更复杂：通常需要粘性会话或连接路由，网关/负载均衡配置更繁琐。
- 安全与鉴权：无法直接使用标准 CORS；令牌通常通过 Cookie、查询参数或子协议，服务端需校验 `Origin`。

## SSE 优点

- 简单可靠：`EventSource` 自带自动重连与 `Last-Event-ID` 断点续传，服务端按事件流持续输出并定期 flush 即可。
- HTTP/2 与代理友好：可复用现有日志、监控、限流与 gzip 压缩。
- 易于治理：可沿用标准头（`Authorization`、`Cookie`），方便融入既有网关。

## SSE 缺点

- 单向推送：客户端回传需走普通 HTTP 请求，无法同一连接双向通信。
- 以文本为主：不原生支持二进制（可 Base64，但效率低）。
- 连接上限与兼容性：浏览器对同源长连接数有限制；IE 不支持，现代浏览器基本支持。

## 典型场景

- 选择 WebSocket：低延迟双向交互、大量二进制或高频消息（聊天、协同编辑、多人白板、实时图表、传感器数据）。
- 选择 SSE：仅需服务端到客户端推送（通知、任务进度、日志流、服务状态），或处在受限网络、希望复用 HTTP/2 与代理。

## 工程实践建议

- 心跳与保活：WebSocket 使用 Ping/Pong 及空闲断线检测，结合 `bufferedAmount` 做背压；SSE 通过注释行 `: keepalive` 保持连接，服务端控制发送速率与队列。
- 鉴权与安全：WebSocket 在握手阶段校验 `Origin`，令牌通过 Cookie、子协议或查询参数；SSE 直接使用 `Authorization`/`Cookie`，沿用既有授权流程。
- 容错与重试：WebSocket 采用指数退避重连，必要时支持会话恢复与未确认消息重放；SSE 利用 `id:` 与 `Last-Event-ID` 恢复断点，并用 `retry:` 指定重试间隔。
- 伸缩与代理：WebSocket 在网关层进行连接路由与限流，通常需要粘性会话或集中式会话；SSE 复用反向代理与 HTTP/2，按连接数和带宽分层限流。
- 组合策略：下行用 SSE、上行用 HTTP；优先 WebSocket，失败自动回退 SSE 提升可达性。

## 快速结论

- 双向、二进制、高频实时 → 选 WebSocket。
- 只读推送、HTTP 基建友好、简化重连 → 选 SSE。