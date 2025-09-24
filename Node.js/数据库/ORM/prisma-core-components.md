# Prisma 核心组成部分详解

Prisma 由四个核心组件构成，每个组件都有其特定的功能和作用：

## 1. Prisma Schema（数据模型定义）

Prisma Schema 是整个 Prisma 工具链的核心，它是一个声明式的配置文件，定义了数据模型、数据库连接和生成器配置。

### 1.1 Schema 文件结构

```prisma
// schema.prisma

// 生成器配置 - 定义如何生成 Prisma Client
generator client {
  provider = "prisma-client-js"
  output   = "./generated/prisma-client"
}

// 数据源配置 - 定义数据库连接
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 数据模型定义
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  profile   Profile?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users") // 自定义表名
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  tags      Tag[]    @relation("PostTags")
  createdAt DateTime @default(now())

  @@map("posts")
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String?
  user   User   @relation(fields: [userId], references: [id])
  userId Int    @unique

  @@map("profiles")
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[] @relation("PostTags")

  @@map("tags")
}
```

### 1.2 数据类型和属性

```prisma
model Example {
  // 基础数据类型
  id          Int       @id @default(autoincrement())
  email       String    @unique
  name        String?   // 可选字段
  age         Int       @default(18)
  isActive    Boolean   @default(true)
  salary      Float
  bio         String?   @db.Text // 数据库特定类型
  avatar      Bytes?    // 二进制数据
  birthDate   DateTime?
  metadata    Json?     // JSON 数据

  // 字段属性
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // 索引和约束
  @@unique([email, name]) // 复合唯一约束
  @@index([age, isActive]) // 复合索引
  @@map("examples") // 自定义表名
}
```

### 1.3 关系定义

```prisma
// 一对一关系
model User {
  id      Int      @id @default(autoincrement())
  profile Profile?
}

model Profile {
  id     Int  @id @default(autoincrement())
  user   User @relation(fields: [userId], references: [id])
  userId Int  @unique
}

// 一对多关系
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  author   User @relation(fields: [authorId], references: [id])
  authorId Int
}

// 多对多关系
model Post {
  id   Int   @id @default(autoincrement())
  tags Tag[] @relation("PostTags")
}

model Tag {
  id    Int    @id @default(autoincrement())
  posts Post[] @relation("PostTags")
}

// 显式多对多关系（中间表）
model PostTag {
  post   Post @relation(fields: [postId], references: [id])
  postId Int
  tag    Tag  @relation(fields: [tagId], references: [id])
  tagId  Int

  @@id([postId, tagId])
}
```

## 2. Prisma Client（类型安全的数据库客户端）

Prisma Client 是一个自动生成的、类型安全的数据库客户端，基于 Prisma Schema 定义生成。

### 2.1 生成 Prisma Client

```bash
# 安装 Prisma CLI
npm install prisma --save-dev

# 安装 Prisma Client
npm install @prisma/client

# 生成 Prisma Client
npx prisma generate

# 或者在 package.json 中添加脚本
{
  "scripts": {
    "db:generate": "prisma generate",
    "postinstall": "prisma generate"
  }
}
```

### 2.2 基础 CRUD 操作

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 创建用户
async function createUser() {
  const user = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
      posts: {
        create: [
          {
            title: 'Hello World',
            content: 'This is my first post'
          }
        ]
      }
    },
    include: {
      posts: true,
      profile: true
    }
  })
  return user
}

// 查询用户
async function getUsers() {
  // 获取所有用户
  const users = await prisma.user.findMany({
    include: {
      posts: {
        where: {
          published: true
        }
      },
      _count: {
        select: {
          posts: true
        }
      }
    }
  })

  // 根据 ID 获取用户
  const user = await prisma.user.findUnique({
    where: {
      id: 1
    },
    include: {
      posts: true
    }
  })

  // 条件查询
  const filteredUsers = await prisma.user.findMany({
    where: {
      email: {
        contains: '@example.com'
      },
      posts: {
        some: {
          published: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10,
    skip: 0
  })

  return { users, user, filteredUsers }
}

// 更新用户
async function updateUser(id: number) {
  const user = await prisma.user.update({
    where: {
      id: id
    },
    data: {
      name: 'Alice Updated',
      posts: {
        updateMany: {
          where: {
            published: false
          },
          data: {
            published: true
          }
        }
      }
    },
    include: {
      posts: true
    }
  })
  return user
}

// 删除用户
async function deleteUser(id: number) {
  // 级联删除相关数据
  const deleteUser = await prisma.user.delete({
    where: {
      id: id
    }
  })
  return deleteUser
}
```

### 2.3 高级查询功能

```typescript
// 聚合查询
async function aggregateData() {
  const result = await prisma.user.aggregate({
    _count: {
      id: true
    },
    _avg: {
      id: true
    },
    _sum: {
      id: true
    },
    _min: {
      createdAt: true
    },
    _max: {
      createdAt: true
    },
    where: {
      posts: {
        some: {
          published: true
        }
      }
    }
  })
  return result
}

// 分组查询
async function groupByData() {
  const result = await prisma.post.groupBy({
    by: ['authorId'],
    _count: {
      id: true
    },
    _avg: {
      id: true
    },
    having: {
      id: {
        _avg: {
          gt: 1
        }
      }
    }
  })
  return result
}

// 原生 SQL 查询
async function rawQuery() {
  // 原生查询
  const users = await prisma.$queryRaw`
    SELECT * FROM users 
    WHERE email LIKE ${'%@example.com'}
  `

  // 原生执行
  const result = await prisma.$executeRaw`
    UPDATE users SET name = 'Updated' 
    WHERE id = ${1}
  `

  return { users, result }
}
```

### 2.4 事务处理

```typescript
// 交互式事务
async function transferMoney(fromUserId: number, toUserId: number, amount: number) {
  return await prisma.$transaction(async (tx) => {
    // 检查余额
    const fromUser = await tx.user.findUnique({
      where: { id: fromUserId }
    })

    if (!fromUser || fromUser.balance < amount) {
      throw new Error('Insufficient balance')
    }

    // 扣除发送方余额
    await tx.user.update({
      where: { id: fromUserId },
      data: { balance: { decrement: amount } }
    })

    // 增加接收方余额
    await tx.user.update({
      where: { id: toUserId },
      data: { balance: { increment: amount } }
    })

    // 记录交易
    await tx.transaction.create({
      data: {
        fromUserId,
        toUserId,
        amount,
        type: 'TRANSFER'
      }
    })
  })
}

// 批量事务
async function batchTransaction() {
  const [userCount, postCount] = await prisma.$transaction([
    prisma.user.count(),
    prisma.post.count(),
  ])

  return { userCount, postCount }
}
```

## 3. Prisma Migrate（数据库迁移工具）

Prisma Migrate 是一个声明式数据库迁移工具，帮助你管理数据库模式的变更。

### 3.1 迁移工作流程

```bash
# 1. 修改 schema.prisma 文件
# 2. 创建并应用迁移
npx prisma migrate dev --name add-user-profile

# 3. 生成 Prisma Client
npx prisma generate

# 4. 部署到生产环境
npx prisma migrate deploy
```

### 3.2 迁移文件结构

```
prisma/
├── schema.prisma
└── migrations/
    ├── 20231201120000_init/
    │   └── migration.sql
    ├── 20231202130000_add_user_profile/
    │   └── migration.sql
    └── migration_lock.toml
```

### 3.3 迁移示例

```sql
-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
```

### 3.4 高级迁移场景

#### 数据迁移
```sql
-- 在迁移中处理数据转换
UPDATE "users" SET "status" = 'ACTIVE' WHERE "status" IS NULL;
```

#### 自定义 SQL
```bash
# 创建空迁移文件
npx prisma migrate dev --create-only --name custom-migration

# 编辑生成的 migration.sql 文件
# 添加自定义 SQL 逻辑

# 应用迁移
npx prisma migrate dev
```

### 3.5 迁移最佳实践

```bash
# 开发环境
npx prisma migrate dev --name descriptive-name

# 重置数据库（谨慎使用）
npx prisma migrate reset

# 生产环境部署
npx prisma migrate deploy

# 检查迁移状态
npx prisma migrate status

# 解决迁移冲突
npx prisma migrate resolve --applied "20231201120000_conflicted_migration"
```

### 3.6 环境特定策略

```bash
# 开发环境 - 允许数据丢失
npx prisma migrate dev

# 预生产环境 - 验证迁移
npx prisma migrate diff --from-migrations ./prisma/migrations --to-schema-datamodel ./prisma/schema.prisma

# 生产环境 - 只部署已验证的迁移
npx prisma migrate deploy
```

## 4. Prisma Studio（可视化数据库管理工具）

Prisma Studio 是一个现代化的数据库管理界面，提供直观的数据浏览和编辑功能。

### 4.1 启动 Prisma Studio

```bash
# 启动 Studio
npx prisma studio

# 指定端口
npx prisma studio --port 5555

# 指定浏览器
npx prisma studio --browser chrome
```

### 4.2 主要功能特性

#### 数据浏览
- **表格视图**：以表格形式展示数据
- **关系导航**：点击关联字段快速跳转
- **筛选和排序**：支持多字段筛选和排序
- **分页浏览**：处理大数据集的分页显示

#### 数据编辑
```typescript
// Studio 支持的操作类型
interface StudioOperations {
  create: '创建新记录'
  update: '更新现有记录'
  delete: '删除记录'
  bulkEdit: '批量编辑'
}
```

#### 高级查询
```sql
-- Studio 支持的查询功能
SELECT * FROM users 
WHERE email LIKE '%@example.com'
ORDER BY createdAt DESC
LIMIT 10
```

### 4.3 界面操作指南

#### 导航面板
- **模型列表**：显示所有数据模型
- **记录统计**：显示每个表的记录数量
- **关系图**：可视化模型之间的关系

#### 数据操作
```typescript
// 支持的数据类型编辑
interface SupportedTypes {
  string: '文本输入框'
  number: '数字输入框'
  boolean: '复选框'
  datetime: '日期时间选择器'
  json: 'JSON 编辑器'
  relation: '关系选择器'
}
```

### 4.4 数据导入导出

#### 导出功能
```bash
# 导出为 CSV
# Studio 界面提供导出按钮

# 导出为 JSON
# 支持选择性字段导出
```

#### 导入功能
```typescript
// 支持的导入格式
interface ImportFormats {
  csv: 'CSV 文件导入'
  json: 'JSON 数据导入'
  sql: 'SQL 脚本导入'
}
```

### 4.5 配置和自定义

#### 环境配置
```env
# .env
DATABASE_URL="postgresql://user:pass@localhost:5432/mydb"
PRISMA_STUDIO_PORT=5555
```

#### 自定义设置
```json
{
  "studio": {
    "theme": "dark",
    "pageSize": 50,
    "autoRefresh": true,
    "showSystemTables": false
  }
}
```

### 4.6 安全注意事项

#### 生产环境使用
```typescript
// 生产环境安全配置
const studioConfig = {
  // 不要在生产环境暴露 Studio
  enabled: process.env.NODE_ENV !== 'production',
  
  // 使用 VPN 或内网访问
  host: '127.0.0.1',
  
  // 启用身份验证
  auth: {
    enabled: true,
    provider: 'oauth'
  }
}
```

#### 访问控制
```bash
# 使用 SSH 隧道安全访问
ssh -L 5555:localhost:5555 user@production-server

# 或使用反向代理
nginx -s reload
```

### 4.7 与其他工具集成

#### CI/CD 集成
```yaml
# GitHub Actions 示例
name: Database Management
on:
  workflow_dispatch:
    inputs:
      action:
        description: 'Studio action'
        required: true
        default: 'start'

jobs:
  studio:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Start Prisma Studio
        run: npx prisma studio --port 5555
```

#### Docker 集成
```dockerfile
# Dockerfile for Studio
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

EXPOSE 5555

CMD ["npx", "prisma", "studio", "--hostname", "0.0.0.0"]
```

## 5. 完整项目示例和最佳实践

### 5.1 项目结构

```
prisma-example/
├── prisma/
│   ├── schema.prisma          # 数据库模式定义
│   ├── seed.ts               # 数据库种子文件
│   └── migrations/           # 数据库迁移文件
├── src/
│   ├── lib/
│   │   └── prisma.ts         # Prisma 客户端配置
│   ├── services/
│   │   ├── userService.ts    # 用户服务层
│   │   ├── postService.ts    # 文章服务层
│   │   └── commentService.ts # 评论服务层
│   ├── controllers/          # 控制器层
│   ├── middleware/           # 中间件
│   ├── types/               # 类型定义
│   └── index.ts             # 应用入口
├── package.json
├── .env.example             # 环境变量示例
└── README.md
```

### 5.2 核心配置文件

#### package.json 脚本配置
```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:migrate:dev": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:migrate:reset": "prisma migrate reset --force",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "db:push": "prisma db push",
    "db:pull": "prisma db pull"
  }
}
```

#### 环境变量配置
```env
# .env
DATABASE_URL="postgresql://username:password@localhost:5432/mydb"
NODE_ENV="development"
JWT_SECRET="your-secret-key"
```

### 5.3 Prisma 客户端最佳实践

#### 客户端配置 (src/lib/prisma.ts)
```typescript
import { PrismaClient } from '@prisma/client'

// 全局类型声明，避免在开发环境中重复创建实例
declare global {
  var __prisma: PrismaClient | undefined
}

// Prisma 客户端配置
const prismaClientOptions = {
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error'] as const
    : ['error'] as const,
  errorFormat: 'pretty' as const,
}

// 创建 Prisma 客户端实例
const prisma = globalThis.__prisma || new PrismaClient(prismaClientOptions)

if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma
}

// 优雅关闭处理
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export { prisma }
```

### 5.4 服务层设计模式

#### 用户服务示例
```typescript
export class UserService {
  /**
   * 创建用户（使用事务确保数据一致性）
   */
  static async createUser(data: CreateUserData) {
    const hashedPassword = await bcrypt.hash(data.password, 12)

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          username: data.username,
          password: hashedPassword,
          profile: {
            create: {
              preferences: { theme: 'light', notifications: true }
            }
          }
        },
        include: {
          profile: true,
          _count: { select: { posts: true, followers: true } }
        }
      })

      // 记录审计日志
      await tx.auditLog.create({
        data: {
          action: 'CREATE',
          table: 'users',
          recordId: newUser.id,
          newData: { email: newUser.email, username: newUser.username }
        }
      })

      return newUser
    })

    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  /**
   * 分页查询用户
   */
  static async getUsers(options: {
    page?: number
    limit?: number
    search?: string
    role?: string
  } = {}) {
    const { page = 1, limit = 10, search, role } = options
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (role) where.role = role

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          _count: { select: { posts: true, followers: true } }
        }
      }),
      prisma.user.count({ where })
    ])

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }
}
```

### 5.5 复杂查询示例

#### 文章查询服务
```typescript
export class PostService {
  /**
   * 获取文章列表（支持多种筛选和排序）
   */
  static async getPosts(options: {
    page?: number
    limit?: number
    search?: string
    categoryId?: string
    tagId?: string
    sortBy?: 'latest' | 'popular' | 'mostLiked'
  } = {}) {
    const { page = 1, limit = 10, search, categoryId, tagId, sortBy = 'latest' } = options
    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = { published: true }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (categoryId) where.categoryId = categoryId
    if (tagId) where.tags = { some: { tagId } }

    // 构建排序条件
    let orderBy: any = { createdAt: 'desc' }
    switch (sortBy) {
      case 'popular':
        orderBy = [
          { viewCount: 'desc' },
          { likeCount: 'desc' },
          { createdAt: 'desc' }
        ]
        break
      case 'mostLiked':
        orderBy = { likeCount: 'desc' }
        break
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          category: true,
          tags: { include: { tag: true } },
          _count: { select: { comments: true, likes: true } }
        }
      }),
      prisma.post.count({ where })
    ])

    return {
      posts: posts.map(post => ({
        ...post,
        tags: post.tags.map(pt => pt.tag)
      })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    }
  }

  /**
   * 获取相关文章
   */
  static async getRelatedPosts(postId: string, limit = 5) {
    const currentPost = await prisma.post.findUnique({
      where: { id: postId },
      include: { tags: { select: { tagId: true } } }
    })

    if (!currentPost) return []

    const tagIds = currentPost.tags.map(t => t.tagId)

    return await prisma.post.findMany({
      where: {
        published: true,
        NOT: { id: postId },
        OR: [
          { categoryId: currentPost.categoryId },
          { tags: { some: { tagId: { in: tagIds } } } }
        ]
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        category: true,
        _count: { select: { comments: true, likes: true } }
      }
    })
  }
}
```

### 5.6 数据库种子最佳实践

#### 种子文件 (prisma/seed.ts)
```typescript
import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始数据库种子...')

  // 清理现有数据（仅开发环境）
  if (process.env.NODE_ENV === 'development') {
    await prisma.like.deleteMany()
    await prisma.comment.deleteMany()
    await prisma.postTag.deleteMany()
    await prisma.post.deleteMany()
    await prisma.user.deleteMany()
  }

  // 创建测试用户
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      username: 'admin',
      password: hashedPassword,
      role: UserRole.ADMIN,
      profile: {
        create: {
          website: 'https://admin.example.com',
          preferences: { theme: 'dark', notifications: true }
        }
      }
    }
  })

  // 创建示例文章
  await prisma.post.create({
    data: {
      title: 'Prisma 完全指南',
      slug: 'prisma-complete-guide',
      content: '详细的 Prisma 使用指南...',
      published: true,
      publishedAt: new Date(),
      authorId: admin.id
    }
  })

  console.log('✅ 数据库种子完成！')
}

main()
  .catch((e) => {
    console.error('❌ 种子执行失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### 5.7 性能优化最佳实践

#### 1. 查询优化
```typescript
// ❌ 避免 N+1 查询问题
const posts = await prisma.post.findMany()
for (const post of posts) {
  const author = await prisma.user.findUnique({ where: { id: post.authorId } })
}

// ✅ 使用 include 或 select 预加载关联数据
const posts = await prisma.post.findMany({
  include: {
    author: { select: { id: true, username: true, avatar: true } }
  }
})
```

#### 2. 分页优化
```typescript
// ✅ 使用游标分页处理大数据集
const posts = await prisma.post.findMany({
  take: 10,
  cursor: lastPostId ? { id: lastPostId } : undefined,
  skip: lastPostId ? 1 : 0,
  orderBy: { createdAt: 'desc' }
})
```

#### 3. 索引优化
```prisma
// schema.prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique  // 自动创建索引
  authorId  String
  createdAt DateTime @default(now())
  
  // 复合索引
  @@index([authorId, createdAt])
  @@index([published, createdAt])
}
```

### 5.8 错误处理和日志

#### 错误处理中间件
```typescript
import { Prisma } from '@prisma/client'

export function handlePrismaError(error: any) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return { status: 400, message: '数据已存在，违反唯一约束' }
      case 'P2025':
        return { status: 404, message: '记录不存在' }
      case 'P2003':
        return { status: 400, message: '外键约束失败' }
      default:
        return { status: 500, message: '数据库操作失败' }
    }
  }
  
  return { status: 500, message: '服务器内部错误' }
}
```

### 5.9 测试策略

#### 单元测试示例
```typescript
import { UserService } from '../services/userService'
import { prisma } from '../lib/prisma'

describe('UserService', () => {
  beforeEach(async () => {
    // 清理测试数据
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123'
    }

    const user = await UserService.createUser(userData)

    expect(user.email).toBe(userData.email)
    expect(user.username).toBe(userData.username)
    expect(user.password).toBeUndefined() // 密码应该被移除
  })
})
```

### 5.10 部署和生产环境配置

#### 1. 环境变量管理
```env
# 生产环境
DATABASE_URL="postgresql://user:pass@prod-db:5432/myapp"
NODE_ENV="production"
LOG_LEVEL="error"

# 连接池配置
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=20&pool_timeout=20"
```

#### 2. Docker 配置
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### 3. 生产环境迁移脚本
```bash
#!/bin/bash
# deploy.sh

echo "🚀 开始部署..."

# 运行数据库迁移
npx prisma migrate deploy

# 生成 Prisma 客户端
npx prisma generate

# 启动应用
npm start
```

## 总结

Prisma 作为现代化的 ORM 工具，通过其类型安全、简洁的 API 和强大的工具链，极大地提升了数据库开发的效率和质量。本文档涵盖了 Prisma 的核心组成部分：

1. **Prisma Schema** - 数据库模式定义的核心
2. **Prisma Client** - 类型安全的数据库客户端
3. **Prisma Migrate** - 版本控制的数据库迁移工具
4. **Prisma Studio** - 可视化数据库管理界面
5. **完整项目示例** - 生产级别的最佳实践

通过合理的项目结构、服务层设计、性能优化和错误处理，Prisma 能够为小型项目到大型企业应用提供优秀的开发体验和可靠的性能表现。