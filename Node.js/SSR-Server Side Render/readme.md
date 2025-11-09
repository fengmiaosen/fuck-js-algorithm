# SSR vs CSR（前端开发视角）

## 核心定义
- SSR（Server-Side Rendering）：服务器生成完整 HTML，浏览器接收后进行“水合”（绑定事件、接管状态）。
- CSR（Client-Side Rendering）：服务器返回基础 HTML/空壳，数据获取与 UI 渲染在浏览器端完成，首屏依赖下载与执行前端 JS。

## 用户体验与指标
- SSR
  - 更快首屏展示：提升 `TTFB`、`FCP`、`LCP`。
  - 更佳 SEO：完整 HTML 可直接抓取。
  - 水合开销（hydration overhead）：仍需下载执行 JS 完成水合（hydration），`INP`（Interaction to Next Paint）可能受影响。
- CSR
  - 首屏可能空白：受网络与 JS 执行影响，`FCP`/`LCP` 偏慢。
  - 交互响应好：后续状态切换顺畅。
  - SEO需额外方案：依赖预渲染/动态渲染等。

## SSR 优缺点
- 优点
  - 首屏速度可控，适合内容/交易型页面（电商详情、新闻、文档）。
  - 天然利于 SEO 与社交分享（OG 标签）。
  - 安全性更好：敏感逻辑留在服务端。
- 缺点
  - 服务端计算压力与成本上升。
  - 水合成本高，复杂页面 JS 体积不减，易水合不匹配。
  - 数据获取可能“瀑布式等待”，需并行/流式优化。

## CSR 优缺点
- 优点
  - 前端架构与部署更轻（静态资源 + API）。
  - 交互性强、状态管理灵活，适合应用型场景（后台、IM、看板）。
  - CDN 缓存利用率高，路由切换快（SPA）。
- 缺点
  - 首包与运行时开销显著，易白屏。
  - SEO 不友好，需要预渲染或动态渲染。

## 选型建议
- 选 SSR：强 SEO、内容需快速可见；首屏数据对用户极重要；需要良好社交分享（OG/Twitter Card）。
- 选 CSR：应用型前端、复杂交互与多状态；首屏可接受骨架屏；统一前端逻辑、API 驱动优先。

## 常见陷阱与优化
- SSR
  - 水合不匹配：避免 `Date.now()`、随机数等不确定输出；或使用抑制警告策略。
  - 串行数据获取：并行请求、React Suspense + 流式 SSR（Next.js `app/`）。
  - 关键渲染路径：内联关键 CSS，延迟非关键资源，减少水合 JS（RSC/部分水合）。
  - 缓存策略：`Cache-Control`、CDN、段级缓存；按路径、用户态、参数分层。
- CSR
  - 首包过大：路由/组件拆分，`dynamic import`，按需加载。
  - 资源优先级：`preload/prefetch` 优化关键资源次序。
  - 交互卡顿：避免大型同步计算；用 `Web Worker`/虚拟列表/批量更新。

## 框架实践（Next.js 示例）
- SSR 页面（请求时渲染）
```tsx
// pages/product/[id].tsx
export async function getServerSideProps({ params }) {
  const res = await fetch(`https://api.example.com/products/${params.id}`);
  const product = await res.json();
  return { props: { product } };
}
export default function Product({ product }) {
  return <div>{product.title}</div>;
}
```
- CSR 页面（客户端获取数据）
```tsx
// pages/dashboard.tsx
import { useEffect, useState } from 'react';
export default function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setData);
  }, []);
  if (!data) return <div>Loading...</div>;
  return <div>{data.title}</div>;
}
```
- 现代优化（React Server Components + 流式 SSR）
  - 将无交互的重型组件放在服务端渲染为 HTML（减少水合 JS）。
  - 使用流式传输与 `Suspense` “边下边渲染”，改善 `LCP`。

## 组合策略
- 内容页：SSG/ISR + RSC（静态生成 + 定期再生，尽量减 JS）。
- 应用页：CSR + 局部 SSR（关键首屏块流式输出）。
- 边缘渲染：将 SSR 移至边缘节点（如 Vercel/Cloudflare）降低 `TTFB`。
- 统一度量：以 `TTFB/LCP/INP/CLS` 为核心指标做 A/B 验证。

## 总结
- SSR 优先解决“看得见的快”和 SEO；
CSR 优先解决“用起来顺”和开发简单。
根据业务目标、首屏体验与成本约束，结合 RSC、Streaming、ISR 灵活组合。