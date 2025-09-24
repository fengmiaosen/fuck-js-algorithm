# Prisma 完整项目示例

这是一个使用 Prisma 构建的完整博客系统示例，展示了 Prisma 的核心功能和最佳实践。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

复制环境变量示例文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置你的数据库连接：

```env
DATABASE_URL="postgresql://username:password@localhost:5432/prisma_example"
```

### 3. 数据库设置

```bash
# 生成 Prisma 客户端
npm run db:generate

# 运行数据库迁移
npm run db:migrate:dev

# 填充示例数据
npm run db:seed
```

### 4. 启动应用

```bash
# 开发模式
npm run dev

# 生产模式
npm run build
npm start
```

## 📁 项目结构

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
│   │   └── postService.ts    # 文章服务层
│   └── index.ts             # 应用入口
├── package.json
├── .env.example             # 环境变量示例
└── README.md
```

## 🗄️ 数据库模型

### 核心模型

- **User** - 用户模型（支持角色、资料、关注关系）
- **Post** - 文章模型（支持分类、标签、点赞、评论）
- **Comment** - 评论模型（支持嵌套回复）
- **Category** - 分类模型
- **Tag** - 标签模型
- **Like** - 点赞模型
- **Follow** - 关注关系模型

### 关系设计

- 用户与文章：一对多关系
- 文章与分类：多对一关系
- 文章与标签：多对多关系
- 用户与用户：多对多关注关系
- 支持嵌套评论和点赞功能

## 🛠️ 可用脚本

### 数据库操作

```bash
# 生成 Prisma 客户端
npm run db:generate

# 开发环境迁移（创建并应用迁移）
npm run db:migrate:dev

# 生产环境迁移（仅应用迁移）
npm run db:migrate:deploy

# 重置数据库（危险操作）
npm run db:migrate:reset

# 填充示例数据
npm run db:seed

# 启动 Prisma Studio
npm run db:studio

# 推送 schema 变更（原型开发）
npm run db:push

# 从现有数据库拉取 schema
npm run db:pull
```

### 开发工具

```bash
# 开发模式（热重载）
npm run dev

# 构建项目
npm run build

# 启动生产版本
npm start

# 运行测试
npm test

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 📊 示例数据

运行 `npm run db:seed` 后，系统会创建以下测试数据：

### 测试账户

- **管理员**: admin@example.com / password123
- **用户1**: john@example.com / password123  
- **用户2**: jane@example.com / password123

### 示例内容

- 3个用户账户（包含完整资料）
- 3个文章分类
- 8个标签
- 3篇示例文章
- 评论和点赞数据
- 用户关注关系

## 🔧 核心功能

### 用户管理

- ✅ 用户注册和登录
- ✅ 用户资料管理
- ✅ 角色权限控制
- ✅ 关注/取消关注
- ✅ 用户列表和搜索

### 文章系统

- ✅ 文章创建和编辑
- ✅ 文章分类和标签
- ✅ 文章发布/草稿状态
- ✅ 文章搜索和筛选
- ✅ 文章排序（最新、热门、最多点赞）
- ✅ 相关文章推荐

### 互动功能

- ✅ 文章点赞/取消点赞
- ✅ 评论和回复（支持嵌套）
- ✅ 浏览量统计
- ✅ 用户动态

### 数据分析

- ✅ 文章统计信息
- ✅ 用户活跃度分析
- ✅ 热门内容排行
- ✅ 审计日志记录

## 🎯 最佳实践展示

### 1. 类型安全

- 完整的 TypeScript 类型定义
- Prisma 自动生成的类型
- 服务层接口设计

### 2. 数据库设计

- 合理的关系设计
- 索引优化
- 数据完整性约束

### 3. 查询优化

- 避免 N+1 查询问题
- 使用 include 和 select 优化
- 分页和游标分页
- 复杂查询示例

### 4. 事务处理

- 数据一致性保证
- 错误回滚机制
- 审计日志记录

### 5. 错误处理

- Prisma 错误类型处理
- 友好的错误消息
- 日志记录

### 6. 性能优化

- 连接池配置
- 查询优化
- 缓存策略

## 🧪 测试

项目包含完整的测试示例：

```bash
# 运行所有测试
npm test

# 监听模式
npm run test:watch
```

测试覆盖：
- 服务层单元测试
- 数据库操作测试
- 错误处理测试

## 🚀 部署

### Docker 部署

```bash
# 构建镜像
docker build -t prisma-example .

# 运行容器
docker run -p 3000:3000 --env-file .env prisma-example
```

### 生产环境

1. 设置生产环境变量
2. 运行数据库迁移：`npx prisma migrate deploy`
3. 生成客户端：`npx prisma generate`
4. 启动应用：`npm start`

## 📚 学习资源

- [Prisma 官方文档](https://www.prisma.io/docs)
- [Prisma Schema 参考](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License