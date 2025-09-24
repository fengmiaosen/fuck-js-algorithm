// 注意：这个文件需要先安装依赖才能正常工作
// 运行: npm install @prisma/client bcryptjs
// 运行: npm install -D @types/bcryptjs

// import { PrismaClient, UserRole } from '@prisma/client'
// import bcrypt from 'bcryptjs'

// 占位符实现，实际使用时需要安装依赖
const UserRole = {
  ADMIN: 'ADMIN',
  USER: 'USER'
} as const

const bcrypt = {
  hash: async (password: string, rounds: number) => `hashed_${password}`,
  compare: async (password: string, hash: string) => password === hash.replace('hashed_', '')
}

// 占位符 Prisma 客户端
const prisma = {
  user: {
    deleteMany: async () => ({ count: 0 }),
    create: async (data: any) => ({ id: 'mock-id', ...data.data }),
    findMany: async () => []
  },
  category: {
    deleteMany: async () => ({ count: 0 }),
    create: async (data: any) => ({ id: 'mock-id', ...data.data })
  },
  tag: {
    deleteMany: async () => ({ count: 0 }),
    create: async (data: any) => ({ id: 'mock-id', ...data.data })
  },
  post: {
    deleteMany: async () => ({ count: 0 }),
    create: async (data: any) => ({ id: 'mock-id', ...data.data }),
    update: async (params: any) => ({ id: params.where.id, ...params.data })
  },
  postTag: {
    deleteMany: async () => ({ count: 0 }),
    create: async (data: any) => ({ id: 'mock-id', ...data.data })
  },
  comment: {
    deleteMany: async () => ({ count: 0 }),
    create: async (data: any) => ({ id: 'mock-id', ...data.data })
  },
  like: {
    deleteMany: async () => ({ count: 0 }),
    create: async (data: any) => ({ id: 'mock-id', ...data.data })
  },
  follow: {
    deleteMany: async () => ({ count: 0 }),
    create: async (data: any) => ({ id: 'mock-id', ...data.data })
  },
  profile: {
    deleteMany: async () => ({ count: 0 }),
    create: async (data: any) => ({ id: 'mock-id', ...data.data })
  },
  setting: {
    deleteMany: async () => ({ count: 0 }),
    create: async (data: any) => ({ id: 'mock-id', ...data.data })
  },
  $disconnect: async () => console.log('Mock prisma disconnect')
}

async function main() {
  console.log('🌱 开始数据库种子...')

  // 清理现有数据（开发环境）
  if (process.env.NODE_ENV === 'development') {
    await prisma.like.deleteMany()
    await prisma.comment.deleteMany()
    await prisma.postTag.deleteMany()
    await prisma.post.deleteMany()
    await prisma.tag.deleteMany()
    await prisma.category.deleteMany()
    await prisma.follow.deleteMany()
    await prisma.profile.deleteMany()
    await prisma.user.deleteMany()
    console.log('🧹 清理现有数据完成')
  }

  // 创建用户
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      username: 'admin',
      password: hashedPassword,
      firstName: '管理员',
      lastName: '用户',
      role: UserRole.ADMIN,
      bio: '系统管理员账户',
      profile: {
        create: {
          website: 'https://admin.example.com',
          location: '北京',
          socialLinks: {
            twitter: '@admin',
            github: 'admin'
          },
          preferences: {
            theme: 'dark',
            notifications: true
          }
        }
      }
    }
  })

  const john = await prisma.user.create({
    data: {
      email: 'john@example.com',
      username: 'john_doe',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      bio: '全栈开发者，热爱技术分享',
      profile: {
        create: {
          website: 'https://johndoe.dev',
          location: '上海',
          socialLinks: {
            twitter: '@johndoe',
            github: 'johndoe',
            linkedin: 'john-doe'
          }
        }
      }
    }
  })

  const jane = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      username: 'jane_smith',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      bio: '前端工程师，UI/UX 设计爱好者',
      profile: {
        create: {
          location: '深圳',
          socialLinks: {
            dribbble: 'janesmith',
            behance: 'janesmith'
          }
        }
      }
    }
  })

  console.log('👥 用户创建完成')

  // 创建分类
  const techCategory = await prisma.category.create({
    data: {
      name: '技术',
      slug: 'technology',
      description: '技术相关文章',
      color: '#3B82F6'
    }
  })

  const designCategory = await prisma.category.create({
    data: {
      name: '设计',
      slug: 'design',
      description: '设计相关文章',
      color: '#8B5CF6'
    }
  })

  const lifestyleCategory = await prisma.category.create({
    data: {
      name: '生活',
      slug: 'lifestyle',
      description: '生活感悟和经验分享',
      color: '#10B981'
    }
  })

  console.log('📂 分类创建完成')

  // 创建标签
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'JavaScript', color: '#F7DF1E' } }),
    prisma.tag.create({ data: { name: 'TypeScript', color: '#3178C6' } }),
    prisma.tag.create({ data: { name: 'React', color: '#61DAFB' } }),
    prisma.tag.create({ data: { name: 'Node.js', color: '#339933' } }),
    prisma.tag.create({ data: { name: 'Prisma', color: '#2D3748' } }),
    prisma.tag.create({ data: { name: 'UI/UX', color: '#FF6B6B' } }),
    prisma.tag.create({ data: { name: '数据库', color: '#4ECDC4' } }),
    prisma.tag.create({ data: { name: '最佳实践', color: '#45B7D1' } })
  ])

  console.log('🏷️ 标签创建完成')

  // 创建文章
  const post1 = await prisma.post.create({
    data: {
      title: 'Prisma 完全指南：现代化的数据库工具',
      slug: 'prisma-complete-guide',
      content: `
# Prisma 完全指南

Prisma 是一个现代化的数据库工具包，它简化了数据库访问，提供了类型安全的查询构建器。

## 主要特性

1. **类型安全**：自动生成的 TypeScript 类型
2. **直观的 API**：简洁易懂的查询语法
3. **数据库迁移**：版本控制的数据库 schema
4. **可视化工具**：Prisma Studio 数据库管理界面

## 快速开始

\`\`\`bash
npm install prisma @prisma/client
npx prisma init
\`\`\`

这是一篇详细介绍 Prisma 使用方法的文章...
      `,
      excerpt: '深入了解 Prisma 这个现代化的数据库工具包，从基础概念到高级用法。',
      published: true,
      publishedAt: new Date(),
      authorId: john.id,
      categoryId: techCategory.id,
      tags: {
        create: [
          { tagId: tags.find(t => t.name === 'Prisma')!.id },
          { tagId: tags.find(t => t.name === 'TypeScript')!.id },
          { tagId: tags.find(t => t.name === '数据库')!.id }
        ]
      }
    }
  })

  const post2 = await prisma.post.create({
    data: {
      title: 'React 18 新特性详解',
      slug: 'react-18-new-features',
      content: `
# React 18 新特性详解

React 18 带来了许多令人兴奋的新特性，包括并发渲染、自动批处理等。

## 主要更新

1. **并发渲染**：提升用户体验
2. **自动批处理**：优化性能
3. **Suspense 改进**：更好的加载状态管理

让我们深入了解这些新特性...
      `,
      excerpt: '探索 React 18 的新特性，了解如何利用这些功能提升应用性能。',
      published: true,
      publishedAt: new Date(Date.now() - 86400000), // 1天前
      authorId: jane.id,
      categoryId: techCategory.id,
      tags: {
        create: [
          { tagId: tags.find(t => t.name === 'React')!.id },
          { tagId: tags.find(t => t.name === 'JavaScript')!.id }
        ]
      }
    }
  })

  const post3 = await prisma.post.create({
    data: {
      title: 'UI/UX 设计的最佳实践',
      slug: 'ui-ux-best-practices',
      content: `
# UI/UX 设计的最佳实践

好的用户界面设计不仅仅是美观，更重要的是用户体验。

## 设计原则

1. **简洁性**：保持界面简洁明了
2. **一致性**：统一的设计语言
3. **可访问性**：考虑所有用户群体

这些原则将帮助你创建更好的用户体验...
      `,
      excerpt: '学习 UI/UX 设计的核心原则，创建更好的用户体验。',
      published: true,
      publishedAt: new Date(Date.now() - 172800000), // 2天前
      authorId: jane.id,
      categoryId: designCategory.id,
      tags: {
        create: [
          { tagId: tags.find(t => t.name === 'UI/UX')!.id },
          { tagId: tags.find(t => t.name === '最佳实践')!.id }
        ]
      }
    }
  })

  console.log('📝 文章创建完成')

  // 创建评论
  await prisma.comment.create({
    data: {
      content: '这篇文章写得很好！Prisma 确实是一个很棒的工具。',
      authorId: jane.id,
      postId: post1.id
    }
  })

  await prisma.comment.create({
    data: {
      content: '感谢分享，学到了很多关于 React 18 的新知识。',
      authorId: john.id,
      postId: post2.id
    }
  })

  const parentComment = await prisma.comment.create({
    data: {
      content: '设计原则总结得很到位！',
      authorId: admin.id,
      postId: post3.id
    }
  })

  // 创建回复评论
  await prisma.comment.create({
    data: {
      content: '谢谢！这些都是我在实际项目中总结的经验。',
      authorId: jane.id,
      postId: post3.id,
      parentId: parentComment.id
    }
  })

  console.log('💬 评论创建完成')

  // 创建点赞
  await prisma.like.create({
    data: {
      userId: jane.id,
      postId: post1.id
    }
  })

  await prisma.like.create({
    data: {
      userId: admin.id,
      postId: post1.id
    }
  })

  await prisma.like.create({
    data: {
      userId: john.id,
      postId: post2.id
    }
  })

  console.log('👍 点赞创建完成')

  // 创建关注关系
  await prisma.follow.create({
    data: {
      followerId: jane.id,
      followingId: john.id
    }
  })

  await prisma.follow.create({
    data: {
      followerId: admin.id,
      followingId: john.id
    }
  })

  await prisma.follow.create({
    data: {
      followerId: john.id,
      followingId: jane.id
    }
  })

  console.log('👥 关注关系创建完成')

  // 更新文章统计
  await prisma.post.update({
    where: { id: post1.id },
    data: { 
      likeCount: 2,
      viewCount: 150
    }
  })

  await prisma.post.update({
    where: { id: post2.id },
    data: { 
      likeCount: 1,
      viewCount: 89
    }
  })

  await prisma.post.update({
    where: { id: post3.id },
    data: { 
      viewCount: 67
    }
  })

  console.log('📊 统计数据更新完成')

  // 创建系统设置
  await prisma.setting.create({
    data: {
      key: 'site_name',
      value: 'Prisma 博客示例'
    }
  })

  await prisma.setting.create({
    data: {
      key: 'site_description',
      value: '一个使用 Prisma 构建的现代化博客系统'
    }
  })

  await prisma.setting.create({
    data: {
      key: 'features',
      value: {
        comments: true,
        likes: true,
        follows: true,
        categories: true,
        tags: true
      }
    }
  })

  console.log('⚙️ 系统设置创建完成')

  console.log('✅ 数据库种子完成！')
  console.log(`
📊 创建的数据统计：
- 用户: 3 个
- 分类: 3 个  
- 标签: 8 个
- 文章: 3 篇
- 评论: 4 条
- 点赞: 3 个
- 关注: 3 个关系
- 设置: 3 项

🔑 测试账户：
- 管理员: admin@example.com / password123
- 用户1: john@example.com / password123  
- 用户2: jane@example.com / password123
  `)
}

main()
  .catch((e) => {
    console.error('❌ 种子执行失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })