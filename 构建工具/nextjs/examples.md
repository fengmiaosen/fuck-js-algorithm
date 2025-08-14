# Next.js 实践示例

## 1. 基础页面结构

### 首页 (pages/index.js)
```jsx
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Next.js 应用</title>
        <meta name="description" content="Next.js 示例应用" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          欢迎使用 Next.js
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/ssr" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">SSR 示例</h2>
            <p className="text-gray-600">服务器端渲染页面</p>
          </Link>
          
          <Link href="/ssg" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">SSG 示例</h2>
            <p className="text-gray-600">静态站点生成</p>
          </Link>
          
          <Link href="/api/users" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">API 示例</h2>
            <p className="text-gray-600">API 路由演示</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
```

## 2. SSR 页面示例

### pages/ssr.js
```jsx
export default function SSRPage({ data, timestamp }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">SSR 页面示例</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">服务器端数据</h2>
        <p className="text-gray-600 mb-2">
          <strong>生成时间:</strong> {timestamp}
        </p>
        <p className="text-gray-600 mb-4">
          <strong>数据:</strong> {JSON.stringify(data)}
        </p>
        
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-sm text-blue-800">
            这个页面在每次请求时都会在服务器端重新生成，确保数据始终是最新的。
          </p>
        </div>
      </div>
    </div>
  )
}

// SSR: 每次请求都会执行
export async function getServerSideProps() {
  // 模拟 API 调用
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1')
  const data = await response.json()
  
  return {
    props: {
      data,
      timestamp: new Date().toISOString()
    }
  }
}
```

## 3. SSG 页面示例

### pages/ssg.js
```jsx
export default function SSGPage({ posts, buildTime }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">SSG 页面示例</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">构建时间</h2>
        <p className="text-gray-600">
          页面构建时间: {buildTime}
        </p>
        <div className="bg-green-50 p-4 rounded mt-4">
          <p className="text-sm text-green-800">
            这个页面在构建时生成，加载速度极快，适合内容不经常变化的页面。
          </p>
        </div>
      </div>
      
      <div className="grid gap-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
            <p className="text-gray-600">{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// SSG: 构建时生成
export async function getStaticProps() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
  const posts = await response.json()
  
  return {
    props: {
      posts,
      buildTime: new Date().toISOString()
    },
    // 可选：重新生成间隔（秒）
    revalidate: 60
  }
}
```

## 4. 动态路由示例

### pages/posts/[id].js
```jsx
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function PostPage({ post }) {
  const router = useRouter()
  
  // 如果页面还在生成中
  if (router.isFallback) {
    return <div className="text-center py-8">加载中...</div>
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/ssg" className="text-blue-600 hover:underline mb-4 inline-block">
        ← 返回列表
      </Link>
      
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-600 mb-6">文章 ID: {post.id}</p>
        <div className="prose max-w-none">
          <p>{post.body}</p>
        </div>
      </div>
    </div>
  )
}

// 生成静态路径
export async function getStaticPaths() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts = await response.json()
  
  const paths = posts.slice(0, 10).map(post => ({
    params: { id: post.id.toString() }
  }))
  
  return {
    paths,
    fallback: 'blocking' // 或者 true 用于 ISR
  }
}

// 获取静态属性
export async function getStaticProps({ params }) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`)
  const post = await response.json()
  
  return {
    props: {
      post
    },
    revalidate: 60 // ISR: 60秒后重新生成
  }
}
```

## 5. API 路由示例

### pages/api/users.js
```jsx
// 模拟数据库
const users = [
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
  { id: 3, name: '王五', email: 'wangwu@example.com' }
]

export default function handler(req, res) {
  const { method } = req
  
  switch (method) {
    case 'GET':
      return getUsers(req, res)
    case 'POST':
      return createUser(req, res)
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

function getUsers(req, res) {
  const { query } = req
  
  if (query.id) {
    const user = users.find(u => u.id === parseInt(query.id))
    if (!user) {
      return res.status(404).json({ error: '用户不存在' })
    }
    return res.status(200).json(user)
  }
  
  res.status(200).json(users)
}

function createUser(req, res) {
  const { name, email } = req.body
  
  if (!name || !email) {
    return res.status(400).json({ error: '姓名和邮箱是必需的' })
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email
  }
  
  users.push(newUser)
  res.status(201).json(newUser)
}
```

### pages/api/users/[id].js
```jsx
export default function handler(req, res) {
  const { method } = req
  const { id } = req.query
  
  switch (method) {
    case 'GET':
      return getUserById(req, res)
    case 'PUT':
      return updateUser(req, res)
    case 'DELETE':
      return deleteUser(req, res)
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

function getUserById(req, res) {
  const { id } = req.query
  // 实现获取用户的逻辑
  res.status(200).json({ id, name: '用户', email: 'user@example.com' })
}

function updateUser(req, res) {
  const { id } = req.query
  const { name, email } = req.body
  // 实现更新用户的逻辑
  res.status(200).json({ id, name, email })
}

function deleteUser(req, res) {
  const { id } = req.query
  // 实现删除用户的逻辑
  res.status(204).end()
}
```

## 6. 图片优化示例

### pages/images.js
```jsx
import Image from 'next/image'
import { useState } from 'react'

export default function ImagesPage() {
  const [isLoading, setIsLoading] = useState(true)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">图片优化示例</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 基础图片 */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">基础图片</h3>
          <Image
            src="https://picsum.photos/400/300"
            alt="随机图片"
            width={400}
            height={300}
            className="rounded"
          />
        </div>
        
        {/* 响应式图片 */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">响应式图片</h3>
          <Image
            src="https://picsum.photos/400/300"
            alt="响应式图片"
            width={400}
            height={300}
            className="rounded"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        {/* 带占位符的图片 */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">带占位符</h3>
          <Image
            src="https://picsum.photos/400/300"
            alt="带占位符的图片"
            width={400}
            height={300}
            className="rounded"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxAAPwCdABmX/9k="
          />
        </div>
      </div>
    </div>
  )
}
```

## 7. 中间件示例

### middleware.js (根目录)
```jsx
import { NextResponse } from 'next/server'

export function middleware(request) {
  // 获取请求路径
  const { pathname } = request.nextUrl
  
  // 检查认证
  const isAuthenticated = request.cookies.get('auth-token')
  
  // 保护的路由
  const protectedRoutes = ['/dashboard', '/profile', '/admin']
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // 重定向到登录页
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // 添加自定义头
  const response = NextResponse.next()
  response.headers.set('x-custom-header', 'nextjs-example')
  
  return response
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

## 8. 布局组件示例

### components/Layout.js
```jsx
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function Layout({ children, title = 'Next.js 应用' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Next.js 示例应用" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* 导航栏 */}
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-xl font-bold text-gray-800">
                Next.js 示例
              </Link>
              
              {/* 桌面菜单 */}
              <div className="hidden md:flex space-x-8">
                <Link href="/ssr" className="text-gray-600 hover:text-gray-900">
                  SSR
                </Link>
                <Link href="/ssg" className="text-gray-600 hover:text-gray-900">
                  SSG
                </Link>
                <Link href="/images" className="text-gray-600 hover:text-gray-900">
                  图片优化
                </Link>
                <Link href="/api/users" className="text-gray-600 hover:text-gray-900">
                  API
                </Link>
              </div>
              
              {/* 移动端菜单按钮 */}
              <button
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            {/* 移动端菜单 */}
            {isMenuOpen && (
              <div className="md:hidden py-4 border-t">
                <div className="flex flex-col space-y-4">
                  <Link href="/ssr" className="text-gray-600 hover:text-gray-900">
                    SSR
                  </Link>
                  <Link href="/ssg" className="text-gray-600 hover:text-gray-900">
                    SSG
                  </Link>
                  <Link href="/images" className="text-gray-600 hover:text-gray-900">
                    图片优化
                  </Link>
                  <Link href="/api/users" className="text-gray-600 hover:text-gray-900">
                    API
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>
        
        {/* 主要内容 */}
        <main>{children}</main>
        
        {/* 页脚 */}
        <footer className="bg-gray-800 text-white py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 Next.js 示例应用. 保留所有权利.</p>
          </div>
        </footer>
      </div>
    </>
  )
}
```

## 9. 配置文件示例

### next.config.js
```jsx
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用实验性功能
  experimental: {
    appDir: true,
  },
  
  // 图片域名白名单
  images: {
    domains: ['picsum.photos', 'via.placeholder.com'],
  },
  
  // 环境变量
  env: {
    customKey: 'my-value',
  },
  
  // 重定向
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ]
  },
  
  // 重写
  async rewrites() {
    return [
      {
        source: '/api/legacy/:path*',
        destination: '/api/:path*',
      },
    ]
  },
  
  // 头部配置
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
        ],
      },
    ]
  },
  
  // 构建输出
  output: 'standalone', // 或者 'export' 用于静态导出
}

module.exports = nextConfig
```

## 10. 部署配置

### package.json 脚本
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "export": "next build && next export"
  }
}
```

### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# 安装依赖
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# 构建应用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 生产镜像
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

这些示例展示了 Next.js 的主要特性和最佳实践，可以帮助您快速上手和深入学习 Next.js。

