# Next.js App Router vs. Pages Router：深度对比

Next.js 提供了两种路由系统：传统的 **Pages Router** 和在 Next.js 13 中引入的 **App Router**。两者在文件结构、数据获取、渲染策略和整体架构上存在显著差异。

## 核心区别一览

| 特性 | Pages Router | App Router |
| --- | --- | --- |
| **路由约定** | `pages/` 目录，文件即路由 | `app/` 目录，文件夹即路由，`page.js` 定义 UI |
| **组件模型** | 仅客户端组件 (Client Components) | 默认服务端组件 (Server Components)，可选择客户端组件 |
| **数据获取** | `getServerSideProps`, `getStaticProps` | 在组件内部直接使用 `fetch`，支持 `async/await` |
| **布局管理** | 通过 `_app.js` 和组件嵌套实现 | 通过 `layout.js` 文件实现，支持嵌套和分组 |
| **渲染策略** | SSR, SSG, ISR | 更细粒度的控制，支持流式渲染 (Streaming) |
| **加载状态** | 手动实现 | 内置 `loading.js`，基于 React Suspense |
| **API 路由** | `pages/api/` 目录 | `app/api/` 目录，使用 `route.js` |

---

## 1. 路由约定 (Routing Conventions)

### Pages Router
基于文件的路由系统，非常直观。
- `pages/index.js` → `/`
- `pages/about.js` → `/about`
- `pages/posts/[id].js` → `/posts/:id`

### App Router
基于文件夹的路由系统，更具结构性。
- `app/page.js` → `/`
- `app/about/page.js` → `/about`
- `app/posts/[id]/page.js` → `/posts/:id`

**关键文件:**
- `page.js`: 定义路由的 UI，是公开可访问的。
- `layout.js`: 定义共享的 UI 布局，可嵌套。
- `loading.js`: 定义加载状态的 UI。
- `error.js`: 定义错误状态的 UI。
- `template.js`: 类似于 `layout.js`，但在导航时会重新渲染。
- `route.js`: 定义 API 路由。

---

## 2. 组件模型 (Component Model)

### Pages Router
所有组件默认都是客户端组件，在浏览器中渲染和执行。

### App Router
引入了 **React Server Components (RSC)** 的概念。
- **服务端组件 (Server Components)**: 默认情况下，`app/` 目录下的所有组件都是服务端组件。它们在服务器上渲染，不能使用 `useState`, `useEffect` 等 hooks，但可以直接访问后端资源（如数据库、文件系统）和执行异步操作。
- **客户端组件 (Client Components)**: 通过在文件顶部添加 `'use client'` 指令来声明。它们在浏览器中渲染，可以使用 hooks 和处理用户交互。

这种分离有助于减少发送到客户端的 JavaScript 包大小，提升性能。

---

## 3. 数据获取 (Data Fetching)

### Pages Router
依赖于特定的 `get...Props` 函数。
```javascript
// pages/posts/[id].js
export async function getServerSideProps(context) {
  const { id } = context.params;
  const res = await fetch(`https://api.example.com/posts/${id}`);
  const post = await res.json();
  return { props: { post } };
}

function PostPage({ post }) {
  // ...
}
```

### App Router
数据获取直接在服务端组件内部完成，代码更简洁、直观。
```javascript
// app/posts/[id]/page.js
async function getPost(id) {
  const res = await fetch(`https://api.example.com/posts/${id}`);
  return res.json();
}

export default async function PostPage({ params }) {
  const post = await getPost(params.id);
  // ...
}
```
Next.js 扩展了 `fetch` API，可以方便地控制缓存和重新验证策略。
```javascript
fetch('...', { cache: 'no-store' }); // 类似于 getServerSideProps
fetch('...', { next: { revalidate: 10 } }); // 类似于 ISR
```

---

## 4. 布局管理 (Layouts)

### Pages Router
通常在 `_app.js` 中定义全局布局，或在每个页面中手动嵌套布局组件。对于复杂的嵌套布局，实现起来比较繁琐。

### App Router
内置了强大的布局系统。
- **根布局 (`app/layout.js`)**: 应用的全局布局，必须包含 `<html>` 和 `<body>` 标签。
- **嵌套布局**: 在每个路由段（文件夹）中，都可以定义一个 `layout.js`，它会自动包裹该段及其子段的 `page.js`。

```javascript
// app/dashboard/layout.js
export default function DashboardLayout({ children }) {
  return (
    <section>
      {/* 共享的仪表盘导航 */}
      <nav>...</nav>
      {children}
    </section>
  );
}
```
这个布局将应用于所有以 `/dashboard` 开头的路由。

---

## 5. 渲染与加载 (Rendering & Loading)

### Pages Router
页面是整体渲染的。在数据获取完成之前，用户可能会看到一个空白页面或加载指示器。

### App Router
支持 **流式渲染 (Streaming)** 和 **React Suspense**。
- **流式渲染**: 服务器可以分块发送 UI，让用户更快地看到页面的非动态部分。
- **内置加载状态**: 你可以在路由段中创建一个 `loading.js` 文件，Next.js 会在加载该路由段的数据时自动显示这个 UI。

```javascript
// app/dashboard/loading.js
export default function Loading() {
  return <p>Loading dashboard...</p>;
}
```

---

## 6. 优缺点对比 (Pros & Cons)

### Pages Router 的优点

- **概念简单**：文件即路由，`getServerSideProps` / `getStaticProps` 一步到位，心智负担小，上手快。
- **生态成熟**：大量旧项目、教程与第三方库天然兼容（多数老库按客户端组件编写，无需适配）。
- **调试直观**：组件代码均在客户端执行，报错定位简单。

### Pages Router 的缺点

- **无 RSC**：所有组件代码（包括 import 的库）都会打包进客户端 bundle，JS 体积大。
- **数据获取粒度粗**：只能页面级取数（`getServerSideProps` 等），数据需从页面 props 层层下钻，组件无法自己取数。
- **布局能力弱**：仅有 `_app.js` / `_document.js` 全局布局；嵌套布局需手动实现，且导航时布局组件重新挂载、状态丢失。
- **整页阻塞渲染**：不支持流式渲染，慢接口会拖慢整页 TTFB；loading 状态需要手动实现。
- **官方重心转移**：处于维护模式，新特性（RSC、Server Actions 等）只进 App Router。

### App Router 的优点

- **RSC 默认**：服务端组件零客户端 JS，bundle 显著减小；服务端组件可直接访问数据库、文件系统等后端资源。
- **组件级数据获取**：async 组件内直接 `fetch`，天然并行，缓存与 revalidate 粒度可精确控制。
- **强大的布局系统**：嵌套 `layout.js`，导航时布局不重新挂载、状态保留；`loading.js` / `error.js` 开箱即用。
- **流式渲染 + Suspense**：先出静态壳、再流式补动态内容，TTFB / FCP 更优。
- **高级路由能力**：并行路由（parallel routes）、拦截路由（intercepting routes）、route handlers、Server Actions。
- **官方未来方向**：持续获得新特性与优化。

### App Router 的缺点

- **学习曲线陡**：RSC 边界、`'use client'`、Suspense、多层缓存体系（Data Cache / Router Cache / Full Route Cache / Request Memoization）概念众多。
- **心智负担**：需要时刻区分服务端/客户端组件；服务端 → 客户端传递的 props 必须可序列化（不能传函数、class 实例等）。
- **生态兼容成本**：多数老库只能以客户端组件方式使用，需要 `'use client'` 包裹或动态导入，滥用会抵消 RSC 的包体积优势。
- **缓存行为复杂且变动频繁**：Next.js 13 → 14 → 15 多次调整缓存默认值（如 Next 15 中 `fetch` 默认不再缓存），升级容易踩坑。
- **调试成本更高**：RSC 在服务端执行，错误定位比纯客户端渲染更复杂。

---

## 总结与选择

| 方面 | Pages Router | App Router |
| --- | --- | --- |
| **易用性** | 非常简单直观，适合初学者和小型项目。 | 概念更多（RSC, Suspense），学习曲线稍陡。 |
| **性能** | 依赖手动优化。 | 通过 RSC 和流式渲染，有更高的性能潜力。 |
| **灵活性** | 布局和路由结构相对固定。 | 提供了更灵活的布局和路由组织方式。 |
| **未来趋势** | 仍受支持，但新功能将主要围绕 App Router 开发。 | Next.js 的未来方向，推荐新项目使用。 |

**何时选择 Pages Router？**
- 维护现有的旧项目。
- 需要快速搭建一个简单的、路由结构不复杂的网站。
- 团队对 App Router 的新概念不熟悉，需要时间过渡。

**何时选择 App Router？**
- 开始一个全新的 Next.js 项目。
- 构建复杂的、具有深度嵌套布局的应用。
- 对性能有极致要求，希望利用 RSC 和流式渲染的优势。

总的来说，**App Router** 是 Next.js 的未来，它提供了更强大、更灵活的架构来构建现代 Web 应用。虽然有一定的学习成本，但其带来的性能和开发体验优势是值得的。对于新项目，强烈建议从 App Router 开始。