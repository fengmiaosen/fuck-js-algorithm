/**
 * NestJS 与其他 Node.js 框架对比示例
 * 展示不同框架的特点、优势和使用场景
 */

console.log('\n=== Node.js 框架对比分析 ===\n');

// 1. Express.js 示例
console.log('1. Express.js - 简单灵活的 Web 框架');
console.log('特点: 轻量级、灵活、中间件丰富');

const expressExample = {
  // Express 路由示例
  setupRoutes: function() {
    console.log('Express 路由设置:');
    console.log(`
// app.js
const express = require('express');
const app = express();

// 中间件
app.use(express.json());
app.use('/api', require('./routes/users'));

// 用户路由
// routes/users.js
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ users: [] });
});

router.post('/', (req, res) => {
  const user = req.body;
  // 处理逻辑
  res.status(201).json(user);
});

module.exports = router;
    `);
  },

  // Express 优缺点
  prosAndCons: {
    pros: [
      '学习曲线平缓，容易上手',
      '生态系统庞大，中间件丰富',
      '灵活性高，可以自由组织代码',
      '性能优秀，开销小',
      '社区活跃，文档完善',
    ],
    cons: [
      '缺乏标准化的项目结构',
      '大型项目难以维护',
      '需要手动处理很多底层细节',
      '缺乏内置的依赖注入',
      'TypeScript 支持需要额外配置',
    ],
  },

  // 适用场景
  useCases: [
    '快速原型开发',
    '小到中型 Web 应用',
    'API 服务',
    '学习 Node.js 开发',
    '需要高度自定义的项目',
  ],
};

// 2. Koa.js 示例
console.log('\n2. Koa.js - 下一代 Web 框架');
console.log('特点: 异步优先、洋葱模型、轻量级');

const koaExample = {
  // Koa 中间件示例
  setupMiddleware: function() {
    console.log('Koa 中间件设置:');
    console.log(`
// app.js
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

// 中间件
app.use(bodyParser());

// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { error: err.message };
  }
});

// 路由
router.get('/users', async (ctx) => {
  ctx.body = { users: [] };
});

router.post('/users', async (ctx) => {
  const user = ctx.request.body;
  // 异步处理
  ctx.status = 201;
  ctx.body = user;
});

app.use(router.routes());
    `);
  },

  prosAndCons: {
    pros: [
      '原生支持 async/await',
      '洋葱模型中间件机制优雅',
      '更好的错误处理',
      '代码更简洁',
      '更小的核心体积',
    ],
    cons: [
      '生态系统相对较小',
      '需要更多的第三方包',
      '学习成本相对较高',
      '社区相对较小',
      '缺乏内置功能',
    ],
  },

  useCases: [
    '现代异步 Web 应用',
    '需要精细控制的 API',
    '微服务架构',
    '对性能要求较高的应用',
  ],
};

// 3. Fastify 示例
console.log('\n3. Fastify - 高性能 Web 框架');
console.log('特点: 高性能、JSON Schema、插件系统');

const fastifyExample = {
  // Fastify 路由示例
  setupRoutes: function() {
    console.log('Fastify 路由设置:');
    console.log(`
// app.js
const fastify = require('fastify')({ logger: true });

// JSON Schema 验证
const userSchema = {
  type: 'object',
  required: ['name', 'email'],
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    age: { type: 'integer', minimum: 0 }
  }
};

// 路由定义
fastify.get('/users', async (request, reply) => {
  return { users: [] };
});

fastify.post('/users', {
  schema: {
    body: userSchema,
    response: {
      201: userSchema
    }
  }
}, async (request, reply) => {
  const user = request.body;
  reply.code(201);
  return user;
});

// 插件注册
fastify.register(require('@fastify/cors'));
fastify.register(require('@fastify/helmet'));
    `);
  },

  prosAndCons: {
    pros: [
      '性能优秀，比 Express 快 2-3 倍',
      '内置 JSON Schema 验证',
      '强大的插件系统',
      'TypeScript 友好',
      '内置日志系统',
      '自动序列化',
    ],
    cons: [
      '生态系统相对较新',
      '学习曲线较陡',
      '插件依赖性强',
      '社区相对较小',
      '文档相对较少',
    ],
  },

  useCases: [
    '高性能 API 服务',
    'JSON API 开发',
    '微服务架构',
    '需要数据验证的应用',
    '对性能敏感的项目',
  ],
};

// 4. NestJS 示例
console.log('\n4. NestJS - 企业级应用框架');
console.log('特点: TypeScript 优先、装饰器、依赖注入');

const nestjsExample = {
  // NestJS 控制器示例
  setupController: function() {
    console.log('NestJS 控制器设置:');
    console.log(`
// user.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
}

// user.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private users = [];

  findAll() {
    return this.users;
  }

  create(user: any) {
    this.users.push(user);
    return user;
  }

  findOne(id: number) {
    return this.users.find(user => user.id === id);
  }
}

// user.module.ts
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
    `);
  },

  prosAndCons: {
    pros: [
      'TypeScript 原生支持',
      '企业级架构设计',
      '强大的依赖注入系统',
      '装饰器驱动开发',
      '模块化架构',
      '内置功能丰富',
      '测试友好',
      '微服务支持',
    ],
    cons: [
      '学习曲线较陡',
      '项目体积较大',
      '配置相对复杂',
      '对简单项目过度设计',
      '启动时间较长',
    ],
  },

  useCases: [
    '企业级 Web 应用',
    '大型团队协作项目',
    '微服务架构',
    '需要长期维护的项目',
    'TypeScript 项目',
    '复杂业务逻辑应用',
  ],
};

// 5. Hapi.js 示例
console.log('\n5. Hapi.js - 配置驱动框架');
console.log('特点: 配置优于代码、内置功能丰富');

const hapiExample = {
  setupServer: function() {
    console.log('Hapi.js 服务器设置:');
    console.log(`
// server.js
const Hapi = require('@hapi/hapi');
const Joi = require('joi');

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  // 路由配置
  server.route({
    method: 'GET',
    path: '/users',
    handler: (request, h) => {
      return { users: [] };
    }
  });

  server.route({
    method: 'POST',
    path: '/users',
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          email: Joi.string().email().required(),
          age: Joi.number().integer().min(0)
        })
      }
    },
    handler: (request, h) => {
      const user = request.payload;
      return h.response(user).code(201);
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};
    `);
  },

  prosAndCons: {
    pros: [
      '配置驱动，声明式开发',
      '内置验证、缓存、认证',
      '强大的插件系统',
      '详细的请求生命周期',
      '企业级特性',
      '安全性好',
    ],
    cons: [
      '学习曲线较陡',
      '配置复杂',
      '社区相对较小',
      '性能不如其他框架',
      '过度工程化',
    ],
  },

  useCases: [
    '企业级应用',
    '需要复杂验证的 API',
    '安全要求高的应用',
    '配置驱动的项目',
  ],
};

// 框架对比表
console.log('\n=== 框架特性对比表 ===\n');

const frameworkComparison = {
  features: {
    'TypeScript 支持': {
      'Express': '需要配置',
      'Koa': '需要配置',
      'Fastify': '良好',
      'NestJS': '原生支持',
      'Hapi': '需要配置',
    },
    '学习曲线': {
      'Express': '简单',
      'Koa': '中等',
      'Fastify': '中等',
      'NestJS': '较难',
      'Hapi': '较难',
    },
    '性能': {
      'Express': '良好',
      'Koa': '良好',
      'Fastify': '优秀',
      'NestJS': '良好',
      'Hapi': '一般',
    },
    '生态系统': {
      'Express': '非常丰富',
      'Koa': '丰富',
      'Fastify': '中等',
      'NestJS': '丰富',
      'Hapi': '中等',
    },
    '企业级特性': {
      'Express': '需要自建',
      'Koa': '需要自建',
      'Fastify': '部分内置',
      'NestJS': '完整支持',
      'Hapi': '完整支持',
    },
    '依赖注入': {
      'Express': '无',
      'Koa': '无',
      'Fastify': '无',
      'NestJS': '内置',
      'Hapi': '无',
    },
    '测试支持': {
      'Express': '需要配置',
      'Koa': '需要配置',
      'Fastify': '良好',
      'NestJS': '优秀',
      'Hapi': '良好',
    },
    '微服务支持': {
      'Express': '需要自建',
      'Koa': '需要自建',
      'Fastify': '部分支持',
      'NestJS': '内置支持',
      'Hapi': '需要自建',
    },
  },

  displayComparison: function() {
    console.log('特性对比:');
    console.log('┌─────────────────┬─────────┬─────────┬─────────┬─────────┬─────────┐');
    console.log('│ 特性            │ Express │ Koa     │ Fastify │ NestJS  │ Hapi    │');
    console.log('├─────────────────┼─────────┼─────────┼─────────┼─────────┼─────────┤');
    
    Object.entries(this.features).forEach(([feature, frameworks]) => {
      const row = `│ ${feature.padEnd(15)} │ ${frameworks.Express.padEnd(7)} │ ${frameworks.Koa.padEnd(7)} │ ${frameworks.Fastify.padEnd(7)} │ ${frameworks.NestJS.padEnd(7)} │ ${frameworks.Hapi.padEnd(7)} │`;
      console.log(row);
    });
    
    console.log('└─────────────────┴─────────┴─────────┴─────────┴─────────┴─────────┘');
  },
};

// 使用场景推荐
console.log('\n=== 使用场景推荐 ===\n');

const useCaseRecommendations = {
  scenarios: {
    '快速原型开发': {
      recommended: 'Express',
      reason: '简单易用，快速上手，生态丰富',
      alternatives: ['Koa', 'Fastify'],
    },
    '小型 Web 应用': {
      recommended: 'Express',
      reason: '轻量级，灵活性高，社区支持好',
      alternatives: ['Koa', 'Fastify'],
    },
    '高性能 API': {
      recommended: 'Fastify',
      reason: '性能优秀，内置验证，TypeScript 友好',
      alternatives: ['Koa', 'Express'],
    },
    '企业级应用': {
      recommended: 'NestJS',
      reason: '架构清晰，TypeScript 支持，企业级特性',
      alternatives: ['Hapi'],
    },
    '微服务架构': {
      recommended: 'NestJS',
      reason: '内置微服务支持，模块化设计',
      alternatives: ['Fastify', 'Koa'],
    },
    '大型团队项目': {
      recommended: 'NestJS',
      reason: '标准化架构，依赖注入，测试友好',
      alternatives: ['Hapi'],
    },
    '现代异步应用': {
      recommended: 'Koa',
      reason: '原生 async/await，洋葱模型',
      alternatives: ['Fastify', 'NestJS'],
    },
    '配置驱动项目': {
      recommended: 'Hapi',
      reason: '配置优于代码，声明式开发',
      alternatives: ['NestJS'],
    },
  },

  displayRecommendations: function() {
    console.log('场景推荐:');
    Object.entries(this.scenarios).forEach(([scenario, recommendation]) => {
      console.log(`\n📋 ${scenario}:`);
      console.log(`   推荐: ${recommendation.recommended}`);
      console.log(`   原因: ${recommendation.reason}`);
      console.log(`   备选: ${recommendation.alternatives.join(', ')}`);
    });
  },
};

// 迁移指南
console.log('\n=== 框架迁移指南 ===\n');

const migrationGuide = {
  migrations: {
    'Express → NestJS': {
      difficulty: '中等',
      steps: [
        '1. 安装 NestJS CLI 和依赖',
        '2. 创建模块结构',
        '3. 将路由转换为控制器',
        '4. 将业务逻辑提取到服务',
        '5. 配置依赖注入',
        '6. 添加 DTO 和验证',
        '7. 编写测试',
      ],
      benefits: [
        'TypeScript 支持',
        '更好的代码组织',
        '依赖注入',
        '测试友好',
      ],
    },
    'Express → Fastify': {
      difficulty: '简单',
      steps: [
        '1. 安装 Fastify',
        '2. 替换路由语法',
        '3. 添加 JSON Schema',
        '4. 配置插件',
        '5. 更新中间件',
      ],
      benefits: [
        '性能提升',
        '内置验证',
        '更好的 TypeScript 支持',
      ],
    },
    'Koa → NestJS': {
      difficulty: '较难',
      steps: [
        '1. 重新设计架构',
        '2. 创建模块和服务',
        '3. 转换中间件为拦截器',
        '4. 配置依赖注入',
        '5. 添加装饰器',
      ],
      benefits: [
        '企业级架构',
        '更好的可维护性',
        '标准化开发',
      ],
    },
  },

  displayMigrations: function() {
    console.log('迁移指南:');
    Object.entries(this.migrations).forEach(([migration, guide]) => {
      console.log(`\n🔄 ${migration}:`);
      console.log(`   难度: ${guide.difficulty}`);
      console.log('   步骤:');
      guide.steps.forEach(step => console.log(`     ${step}`));
      console.log('   收益:');
      guide.benefits.forEach(benefit => console.log(`     • ${benefit}`));
    });
  },
};

// 性能基准测试结果
console.log('\n=== 性能基准测试 ===\n');

const performanceBenchmark = {
  results: {
    'Hello World API': {
      'Fastify': '76,000 req/sec',
      'Koa': '50,000 req/sec',
      'Express': '45,000 req/sec',
      'NestJS': '40,000 req/sec',
      'Hapi': '30,000 req/sec',
    },
    'JSON API': {
      'Fastify': '65,000 req/sec',
      'Koa': '42,000 req/sec',
      'Express': '38,000 req/sec',
      'NestJS': '35,000 req/sec',
      'Hapi': '25,000 req/sec',
    },
    '内存使用': {
      'Express': '15 MB',
      'Koa': '18 MB',
      'Fastify': '20 MB',
      'NestJS': '35 MB',
      'Hapi': '40 MB',
    },
  },

  displayBenchmark: function() {
    console.log('性能测试结果 (仅供参考):');
    Object.entries(this.results).forEach(([test, results]) => {
      console.log(`\n📊 ${test}:`);
      Object.entries(results).forEach(([framework, result]) => {
        console.log(`   ${framework}: ${result}`);
      });
    });
  },
};

// 最佳实践建议
console.log('\n=== 最佳实践建议 ===\n');

const bestPractices = {
  general: [
    '根据项目规模选择合适的框架',
    '考虑团队技术栈和经验',
    '评估长期维护成本',
    '重视性能和安全性',
    '选择活跃的社区支持',
  ],

  specific: {
    'Express': [
      '使用 TypeScript 提高代码质量',
      '采用分层架构组织代码',
      '使用 Helmet 增强安全性',
      '配置适当的错误处理',
      '使用 PM2 进行生产部署',
    ],
    'NestJS': [
      '充分利用依赖注入',
      '合理划分模块边界',
      '编写完整的单元测试',
      '使用 DTO 进行数据验证',
      '配置适当的日志系统',
    ],
    'Fastify': [
      '充分利用 JSON Schema',
      '合理使用插件系统',
      '配置适当的序列化',
      '使用内置的日志功能',
      '优化路由结构',
    ],
  },

  displayBestPractices: function() {
    console.log('通用最佳实践:');
    this.general.forEach((practice, index) => {
      console.log(`${index + 1}. ${practice}`);
    });

    console.log('\n框架特定建议:');
    Object.entries(this.specific).forEach(([framework, practices]) => {
      console.log(`\n${framework}:`);
      practices.forEach((practice, index) => {
        console.log(`  ${index + 1}. ${practice}`);
      });
    });
  },
};

// 执行所有演示
function runComparison() {
  // 显示框架示例
  expressExample.setupRoutes();
  koaExample.setupMiddleware();
  fastifyExample.setupRoutes();
  nestjsExample.setupController();
  hapiExample.setupServer();

  // 显示对比表
  frameworkComparison.displayComparison();

  // 显示使用场景推荐
  useCaseRecommendations.displayRecommendations();

  // 显示迁移指南
  migrationGuide.displayMigrations();

  // 显示性能基准
  performanceBenchmark.displayBenchmark();

  // 显示最佳实践
  bestPractices.displayBestPractices();

  console.log('\n=== 总结 ===\n');
  console.log('选择框架时需要考虑的因素:');
  console.log('1. 项目规模和复杂度');
  console.log('2. 团队技术水平和偏好');
  console.log('3. 性能要求');
  console.log('4. 长期维护成本');
  console.log('5. 社区支持和生态系统');
  console.log('6. TypeScript 支持需求');
  console.log('7. 企业级特性需求');
  
  console.log('\n推荐选择:');
  console.log('• 快速开发/小项目: Express');
  console.log('• 高性能 API: Fastify');
  console.log('• 现代异步应用: Koa');
  console.log('• 企业级应用: NestJS');
  console.log('• 配置驱动项目: Hapi');
}

// 导出所有示例和对比数据
module.exports = {
  expressExample,
  koaExample,
  fastifyExample,
  nestjsExample,
  hapiExample,
  frameworkComparison,
  useCaseRecommendations,
  migrationGuide,
  performanceBenchmark,
  bestPractices,
  runComparison,
};

// 如果直接运行此文件，执行对比演示
if (require.main === module) {
  runComparison();
}