// 注意：这个文件需要先安装依赖才能正常工作
// 运行: npm install @prisma/client

// import { PrismaClient } from '@prisma/client'

// 全局类型声明，避免在开发环境中重复实例化
declare global {
  // eslint-disable-next-line no-var
  var __prisma: any | undefined
}

// Prisma 客户端配置
// 注释掉实际的 Prisma 实例化，直到安装依赖
const prisma = globalThis.__prisma || {
  // 占位符对象，实际使用时需要替换为真实的 PrismaClient 实例
  $connect: async () => console.log('Prisma client placeholder - install dependencies first'),
  $disconnect: async () => console.log('Prisma client placeholder - install dependencies first'),
}

// 在开发环境中缓存 Prisma 客户端实例
if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

// 优雅关闭处理
process.on('beforeExit', async () => {
  if (prisma.$disconnect) {
    await prisma.$disconnect()
  }
})

process.on('SIGINT', async () => {
  if (prisma.$disconnect) {
    await prisma.$disconnect()
  }
  process.exit(0)
})

process.on('SIGTERM', async () => {
  if (prisma.$disconnect) {
    await prisma.$disconnect()
  }
  process.exit(0)
})

export default prisma

// 导出常用类型 - 需要安装依赖后启用
// export type {
//   Prisma,
// } from '@prisma/client'