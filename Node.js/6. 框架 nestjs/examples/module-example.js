/**
 * NestJS 模块和依赖注入示例
 * 展示模块化架构和依赖注入的使用
 */

// 模拟 NestJS 装饰器
function Module(metadata) {
  return function(target) {
    target.moduleMetadata = metadata;
    target.isModule = true;
    return target;
  };
}

function Injectable() {
  return function(target) {
    target.isInjectable = true;
    return target;
  };
}

function Controller(prefix = '') {
  return function(target) {
    target.controllerPrefix = prefix;
    target.isController = true;
    return target;
  };
}

function Inject(token) {
  return function(target, propertyKey, parameterIndex) {
    target.injectedTokens = target.injectedTokens || [];
    target.injectedTokens.push({ token, parameterIndex });
  };
}

// 配置服务
@Injectable()
class ConfigService {
  constructor() {
    this.config = {
      database: {
        host: 'localhost',
        port: 5432,
        username: 'admin',
        password: 'password',
        database: 'nestjs_demo',
      },
      jwt: {
        secret: 'super-secret-key',
        expiresIn: '1h',
      },
      redis: {
        host: 'localhost',
        port: 6379,
      },
      app: {
        port: 3000,
        environment: 'development',
      },
    };
    console.log('⚙️ ConfigService 初始化完成');
  }

  get(key) {
    const keys = key.split('.');
    let value = this.config;
    
    for (const k of keys) {
      value = value[k];
      if (value === undefined) {
        break;
      }
    }
    
    console.log(`🔧 获取配置: ${key} = ${JSON.stringify(value)}`);
    return value;
  }

  set(key, value) {
    const keys = key.split('.');
    let target = this.config;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!target[keys[i]]) {
        target[keys[i]] = {};
      }
      target = target[keys[i]];
    }
    
    target[keys[keys.length - 1]] = value;
    console.log(`🔧 设置配置: ${key} = ${JSON.stringify(value)}`);
  }

  getAll() {
    return { ...this.config };
  }
}

// 日志服务
@Injectable()
class LoggerService {
  constructor(configService) {
    this.configService = configService;
    this.logLevel = this.configService.get('app.environment') === 'production' ? 'warn' : 'debug';
    console.log('📝 LoggerService 初始化完成');
  }

  log(message, context = '') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [LOG] ${context ? `[${context}] ` : ''}${message}`);
  }

  error(message, trace = '', context = '') {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] ${context ? `[${context}] ` : ''}${message}`);
    if (trace) {
      console.error(`[${timestamp}] [TRACE] ${trace}`);
    }
  }

  warn(message, context = '') {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [WARN] ${context ? `[${context}] ` : ''}${message}`);
  }

  debug(message, context = '') {
    if (this.logLevel === 'debug') {
      const timestamp = new Date().toISOString();
      console.debug(`[${timestamp}] [DEBUG] ${context ? `[${context}] ` : ''}${message}`);
    }
  }

  verbose(message, context = '') {
    if (this.logLevel === 'debug') {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [VERBOSE] ${context ? `[${context}] ` : ''}${message}`);
    }
  }
}

// 数据库服务
@Injectable()
class DatabaseService {
  constructor(configService, loggerService) {
    this.configService = configService;
    this.logger = loggerService;
    this.isConnected = false;
    this.connectionPool = [];
    this.init();
  }

  async init() {
    try {
      const dbConfig = this.configService.get('database');
      this.logger.log('正在连接数据库...', 'DatabaseService');
      
      // 模拟数据库连接
      await this.simulateConnection(dbConfig);
      
      this.isConnected = true;
      this.logger.log('数据库连接成功', 'DatabaseService');
    } catch (error) {
      this.logger.error('数据库连接失败', error.message, 'DatabaseService');
      throw error;
    }
  }

  async simulateConnection(config) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config.host && config.port) {
          resolve();
        } else {
          reject(new Error('数据库配置无效'));
        }
      }, 1000);
    });
  }

  async query(sql, params = []) {
    if (!this.isConnected) {
      throw new Error('数据库未连接');
    }

    this.logger.debug(`执行查询: ${sql}`, 'DatabaseService');
    
    // 模拟查询执行
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          rows: [
            { id: 1, name: '模拟数据1' },
            { id: 2, name: '模拟数据2' },
          ],
          rowCount: 2,
        });
      }, 100);
    });
  }

  async transaction(callback) {
    this.logger.debug('开始事务', 'DatabaseService');
    
    try {
      const result = await callback(this);
      this.logger.debug('事务提交', 'DatabaseService');
      return result;
    } catch (error) {
      this.logger.error('事务回滚', error.message, 'DatabaseService');
      throw error;
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      poolSize: this.connectionPool.length,
      config: this.configService.get('database'),
    };
  }
}

// 缓存服务
@Injectable()
class CacheService {
  constructor(configService, loggerService) {
    this.configService = configService;
    this.logger = loggerService;
    this.cache = new Map();
    this.ttlMap = new Map();
    this.init();
  }

  init() {
    const redisConfig = this.configService.get('redis');
    this.logger.log(`缓存服务初始化: ${redisConfig.host}:${redisConfig.port}`, 'CacheService');
    
    // 定期清理过期缓存
    setInterval(() => {
      this.cleanExpiredCache();
    }, 60000); // 每分钟清理一次
  }

  async set(key, value, ttl = 3600) {
    this.cache.set(key, value);
    this.ttlMap.set(key, Date.now() + ttl * 1000);
    this.logger.debug(`缓存设置: ${key}`, 'CacheService');
  }

  async get(key) {
    if (this.isExpired(key)) {
      this.delete(key);
      return null;
    }
    
    const value = this.cache.get(key);
    if (value !== undefined) {
      this.logger.debug(`缓存命中: ${key}`, 'CacheService');
    } else {
      this.logger.debug(`缓存未命中: ${key}`, 'CacheService');
    }
    
    return value;
  }

  async delete(key) {
    this.cache.delete(key);
    this.ttlMap.delete(key);
    this.logger.debug(`缓存删除: ${key}`, 'CacheService');
  }

  async clear() {
    this.cache.clear();
    this.ttlMap.clear();
    this.logger.log('缓存清空', 'CacheService');
  }

  isExpired(key) {
    const expireTime = this.ttlMap.get(key);
    return expireTime && Date.now() > expireTime;
  }

  cleanExpiredCache() {
    let cleanedCount = 0;
    
    for (const [key, expireTime] of this.ttlMap.entries()) {
      if (Date.now() > expireTime) {
        this.cache.delete(key);
        this.ttlMap.delete(key);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      this.logger.debug(`清理过期缓存: ${cleanedCount} 个`, 'CacheService');
    }
  }

  getStats() {
    return {
      totalKeys: this.cache.size,
      expiredKeys: Array.from(this.ttlMap.entries()).filter(([key, expireTime]) => 
        Date.now() > expireTime
      ).length,
    };
  }
}

// 邮件服务
@Injectable()
class EmailService {
  constructor(configService, loggerService) {
    this.configService = configService;
    this.logger = loggerService;
    this.emailQueue = [];
    this.isProcessing = false;
    this.init();
  }

  init() {
    this.logger.log('邮件服务初始化完成', 'EmailService');
    this.processQueue();
  }

  async sendEmail(to, subject, content, options = {}) {
    const email = {
      id: Date.now() + Math.random(),
      to,
      subject,
      content,
      options,
      createdAt: new Date(),
      status: 'pending',
    };

    this.emailQueue.push(email);
    this.logger.log(`邮件加入队列: ${to} - ${subject}`, 'EmailService');
    
    return email.id;
  }

  async processQueue() {
    if (this.isProcessing || this.emailQueue.length === 0) {
      setTimeout(() => this.processQueue(), 5000);
      return;
    }

    this.isProcessing = true;
    
    while (this.emailQueue.length > 0) {
      const email = this.emailQueue.shift();
      
      try {
        await this.sendEmailInternal(email);
        email.status = 'sent';
        this.logger.log(`邮件发送成功: ${email.to}`, 'EmailService');
      } catch (error) {
        email.status = 'failed';
        email.error = error.message;
        this.logger.error(`邮件发送失败: ${email.to}`, error.message, 'EmailService');
      }
    }
    
    this.isProcessing = false;
    setTimeout(() => this.processQueue(), 5000);
  }

  async sendEmailInternal(email) {
    // 模拟邮件发送
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% 成功率
          resolve();
        } else {
          reject(new Error('SMTP 连接失败'));
        }
      }, 1000);
    });
  }

  getQueueStatus() {
    return {
      queueLength: this.emailQueue.length,
      isProcessing: this.isProcessing,
    };
  }
}

// 用户控制器
@Controller('users')
class UserController {
  constructor(userService, loggerService, cacheService) {
    this.userService = userService;
    this.logger = loggerService;
    this.cache = cacheService;
    this.logger.log('UserController 初始化完成', 'UserController');
  }

  async getUsers() {
    this.logger.log('获取用户列表请求', 'UserController');
    
    // 尝试从缓存获取
    const cacheKey = 'users:list';
    let users = await this.cache.get(cacheKey);
    
    if (!users) {
      users = await this.userService.findAll();
      await this.cache.set(cacheKey, users, 300); // 缓存5分钟
    }
    
    return users;
  }

  async createUser(userData) {
    this.logger.log('创建用户请求', 'UserController');
    
    const user = await this.userService.create(userData);
    
    // 清除相关缓存
    await this.cache.delete('users:list');
    
    return user;
  }
}

// 用户服务
@Injectable()
class UserService {
  constructor(databaseService, emailService, loggerService) {
    this.db = databaseService;
    this.email = emailService;
    this.logger = loggerService;
    this.logger.log('UserService 初始化完成', 'UserService');
  }

  async findAll() {
    this.logger.log('查询所有用户', 'UserService');
    
    const result = await this.db.query('SELECT * FROM users');
    return result.rows;
  }

  async create(userData) {
    this.logger.log('创建新用户', 'UserService');
    
    return await this.db.transaction(async (db) => {
      // 插入用户
      const userResult = await db.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [userData.name, userData.email]
      );
      
      const user = userResult.rows[0];
      
      // 发送欢迎邮件
      await this.email.sendEmail(
        user.email,
        '欢迎注册',
        `欢迎 ${user.name} 注册我们的服务！`
      );
      
      return user;
    });
  }
}

// 核心模块
@Module({
  providers: [ConfigService, LoggerService],
  exports: [ConfigService, LoggerService],
})
class CoreModule {
  constructor() {
    console.log('🏗️ CoreModule 初始化完成');
  }
}

// 数据库模块
@Module({
  imports: [CoreModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
class DatabaseModule {
  constructor() {
    console.log('🗄️ DatabaseModule 初始化完成');
  }
}

// 缓存模块
@Module({
  imports: [CoreModule],
  providers: [CacheService],
  exports: [CacheService],
})
class CacheModule {
  constructor() {
    console.log('💾 CacheModule 初始化完成');
  }
}

// 邮件模块
@Module({
  imports: [CoreModule],
  providers: [EmailService],
  exports: [EmailService],
})
class EmailModule {
  constructor() {
    console.log('📧 EmailModule 初始化完成');
  }
}

// 用户模块
@Module({
  imports: [DatabaseModule, EmailModule, CacheModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
class UserModule {
  constructor() {
    console.log('👥 UserModule 初始化完成');
  }
}

// 应用模块
@Module({
  imports: [CoreModule, UserModule],
  controllers: [],
  providers: [],
})
class AppModule {
  constructor() {
    console.log('🚀 AppModule 初始化完成');
  }
}

// 简单的依赖注入容器
class DIContainer {
  constructor() {
    this.providers = new Map();
    this.instances = new Map();
  }

  register(token, provider) {
    this.providers.set(token, provider);
  }

  resolve(token) {
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }

    const provider = this.providers.get(token);
    if (!provider) {
      throw new Error(`Provider for ${token} not found`);
    }

    // 解析依赖
    const dependencies = this.resolveDependencies(provider);
    const instance = new provider(...dependencies);
    
    this.instances.set(token, instance);
    return instance;
  }

  resolveDependencies(provider) {
    // 简化的依赖解析逻辑
    const dependencies = [];
    
    // 这里应该根据装饰器元数据来解析依赖
    // 为了演示，我们手动指定依赖关系
    if (provider === LoggerService) {
      dependencies.push(this.resolve(ConfigService));
    } else if (provider === DatabaseService) {
      dependencies.push(this.resolve(ConfigService), this.resolve(LoggerService));
    } else if (provider === CacheService) {
      dependencies.push(this.resolve(ConfigService), this.resolve(LoggerService));
    } else if (provider === EmailService) {
      dependencies.push(this.resolve(ConfigService), this.resolve(LoggerService));
    } else if (provider === UserService) {
      dependencies.push(this.resolve(DatabaseService), this.resolve(EmailService), this.resolve(LoggerService));
    } else if (provider === UserController) {
      dependencies.push(this.resolve(UserService), this.resolve(LoggerService), this.resolve(CacheService));
    }
    
    return dependencies;
  }
}

// 应用启动器
class NestApplication {
  constructor() {
    this.container = new DIContainer();
    this.modules = [];
  }

  async bootstrap(AppModule) {
    console.log('🚀 启动 NestJS 应用...');
    
    // 注册所有服务
    this.container.register(ConfigService, ConfigService);
    this.container.register(LoggerService, LoggerService);
    this.container.register(DatabaseService, DatabaseService);
    this.container.register(CacheService, CacheService);
    this.container.register(EmailService, EmailService);
    this.container.register(UserService, UserService);
    this.container.register(UserController, UserController);
    
    // 初始化应用模块
    const appModule = new AppModule();
    
    // 解析所有服务实例
    const configService = this.container.resolve(ConfigService);
    const loggerService = this.container.resolve(LoggerService);
    const databaseService = this.container.resolve(DatabaseService);
    const cacheService = this.container.resolve(CacheService);
    const emailService = this.container.resolve(EmailService);
    const userService = this.container.resolve(UserService);
    const userController = this.container.resolve(UserController);
    
    console.log('✅ 所有模块和服务初始化完成');
    
    return {
      configService,
      loggerService,
      databaseService,
      cacheService,
      emailService,
      userService,
      userController,
    };
  }
}

// 演示应用启动和使用
async function demonstrateNestJS() {
  console.log('\n=== NestJS 模块和依赖注入演示 ===\n');
  
  try {
    // 启动应用
    const app = new NestApplication();
    const services = await app.bootstrap(AppModule);
    
    console.log('\n=== 服务功能演示 ===\n');
    
    // 演示配置服务
    console.log('1. 配置服务演示:');
    console.log('数据库配置:', services.configService.get('database'));
    services.configService.set('app.version', '1.0.0');
    console.log('应用版本:', services.configService.get('app.version'));
    
    // 演示缓存服务
    console.log('\n2. 缓存服务演示:');
    await services.cacheService.set('test:key', { data: 'test value' }, 10);
    const cachedValue = await services.cacheService.get('test:key');
    console.log('缓存值:', cachedValue);
    
    // 演示数据库服务
    console.log('\n3. 数据库服务演示:');
    console.log('连接状态:', services.databaseService.getConnectionStatus());
    const queryResult = await services.databaseService.query('SELECT * FROM users');
    console.log('查询结果:', queryResult);
    
    // 演示邮件服务
    console.log('\n4. 邮件服务演示:');
    const emailId = await services.emailService.sendEmail(
      'user@example.com',
      '测试邮件',
      '这是一封测试邮件'
    );
    console.log('邮件ID:', emailId);
    console.log('队列状态:', services.emailService.getQueueStatus());
    
    // 演示用户服务
    console.log('\n5. 用户服务演示:');
    const users = await services.userController.getUsers();
    console.log('用户列表:', users);
    
    const newUser = await services.userController.createUser({
      name: '新用户',
      email: 'newuser@example.com'
    });
    console.log('创建用户:', newUser);
    
    // 演示缓存统计
    console.log('\n6. 缓存统计:');
    console.log('缓存统计:', services.cacheService.getStats());
    
    console.log('\n✅ NestJS 演示完成');
    
  } catch (error) {
    console.error('❌ 应用启动失败:', error.message);
  }
}

// 导出模块和服务
module.exports = {
  // 装饰器
  Module,
  Injectable,
  Controller,
  Inject,
  
  // 服务
  ConfigService,
  LoggerService,
  DatabaseService,
  CacheService,
  EmailService,
  UserService,
  UserController,
  
  // 模块
  CoreModule,
  DatabaseModule,
  CacheModule,
  EmailModule,
  UserModule,
  AppModule,
  
  // 应用
  NestApplication,
  DIContainer,
  
  // 演示函数
  demonstrateNestJS,
};

/**
 * 模块和依赖注入使用说明:
 * 
 * 1. 模块化设计:
 *    - @Module(): 定义模块及其依赖关系
 *    - imports: 导入其他模块
 *    - providers: 注册服务提供者
 *    - controllers: 注册控制器
 *    - exports: 导出服务供其他模块使用
 * 
 * 2. 依赖注入:
 *    - @Injectable(): 标记类为可注入的服务
 *    - 构造函数注入: 通过构造函数参数注入依赖
 *    - @Inject(): 自定义注入令牌
 * 
 * 3. 服务生命周期:
 *    - 单例模式: 默认情况下服务是单例的
 *    - 作用域: 可以配置不同的作用域
 * 
 * 4. 模块特性:
 *    - 延迟加载: 支持模块的延迟加载
 *    - 动态模块: 支持动态创建模块
 *    - 全局模块: 可以创建全局可用的模块
 */

// 如果直接运行此文件，执行演示
if (require.main === module) {
  demonstrateNestJS();
}