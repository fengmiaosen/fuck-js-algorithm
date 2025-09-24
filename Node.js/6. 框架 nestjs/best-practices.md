# NestJS 最佳实践和性能优化指南

## 📋 目录

1. [项目结构最佳实践](#项目结构最佳实践)
2. [代码组织和模块化](#代码组织和模块化)
3. [依赖注入最佳实践](#依赖注入最佳实践)
4. [数据验证和转换](#数据验证和转换)
5. [错误处理和日志](#错误处理和日志)
6. [性能优化](#性能优化)
7. [安全最佳实践](#安全最佳实践)
8. [测试策略](#测试策略)
9. [部署和运维](#部署和运维)
10. [监控和调试](#监控和调试)

## 🏗️ 项目结构最佳实践

### 推荐的目录结构

```
src/
├── app.module.ts              # 根模块
├── main.ts                    # 应用入口
├── common/                    # 公共模块
│   ├── decorators/           # 自定义装饰器
│   ├── filters/              # 异常过滤器
│   ├── guards/               # 守卫
│   ├── interceptors/         # 拦截器
│   ├── pipes/                # 管道
│   ├── middleware/           # 中间件
│   ├── constants/            # 常量
│   ├── enums/                # 枚举
│   ├── interfaces/           # 接口
│   └── utils/                # 工具函数
├── config/                   # 配置文件
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── app.config.ts
├── modules/                  # 业务模块
│   ├── auth/                 # 认证模块
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── guards/
│   │   └── strategies/
│   ├── users/                # 用户模块
│   └── posts/                # 文章模块
├── database/                 # 数据库相关
│   ├── migrations/
│   ├── seeds/
│   └── entities/
└── shared/                   # 共享模块
    ├── services/
    ├── modules/
    └── providers/
```

### 文件命名规范

```typescript
// 控制器
user.controller.ts
auth.controller.ts

// 服务
user.service.ts
email.service.ts

// 模块
user.module.ts
auth.module.ts

// DTO
create-user.dto.ts
update-user.dto.ts

// 实体
user.entity.ts
post.entity.ts

// 接口
user.interface.ts
config.interface.ts

// 守卫
auth.guard.ts
roles.guard.ts

// 拦截器
logging.interceptor.ts
transform.interceptor.ts
```

## 🧩 代码组织和模块化

### 模块设计原则

```typescript
// ✅ 好的模块设计
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    {
      provide: 'USER_CONFIG',
      useFactory: (configService: ConfigService) => ({
        maxUsers: configService.get('MAX_USERS'),
      }),
      inject: [ConfigService],
    },
  ],
  exports: [UserService], // 只导出需要的服务
})
export class UserModule {}

// ❌ 避免的模块设计
@Module({
  imports: [
    // 导入过多不相关的模块
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot(),
    AuthModule,
    PostModule,
    CommentModule,
  ],
  controllers: [UserController, PostController], // 混合不相关的控制器
  providers: [UserService, PostService, EmailService], // 混合不相关的服务
  exports: [UserService, PostService, EmailService], // 导出过多服务
})
export class BadModule {}
```

### 功能模块分离

```typescript
// 核心模块 - 只包含核心功能
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    LoggerModule,
  ],
  exports: [ConfigModule, DatabaseModule, LoggerModule],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule 只能被导入一次');
    }
  }
}

// 共享模块 - 包含可复用的功能
@Module({
  providers: [
    EmailService,
    SmsService,
    FileUploadService,
    CacheService,
  ],
  exports: [
    EmailService,
    SmsService,
    FileUploadService,
    CacheService,
  ],
})
export class SharedModule {}

// 特性模块 - 包含特定业务功能
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    SharedModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

## 💉 依赖注入最佳实践

### 服务生命周期管理

```typescript
// 单例服务 (默认)
@Injectable()
export class UserService {
  private readonly users: User[] = [];
  
  // 单例服务在整个应用生命周期中只创建一次
  findAll(): User[] {
    return this.users;
  }
}

// 请求作用域服务
@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
  ) {}
  
  // 每个请求都会创建新的实例
  getCurrentUser() {
    return this.request.user;
  }
}

// 瞬态服务
@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {
  // 每次注入都会创建新的实例
  generateId(): string {
    return Math.random().toString(36);
  }
}
```

### 自定义提供者

```typescript
// 值提供者
const configProvider = {
  provide: 'APP_CONFIG',
  useValue: {
    apiUrl: 'https://api.example.com',
    timeout: 5000,
  },
};

// 工厂提供者
const databaseProvider = {
  provide: 'DATABASE_CONNECTION',
  useFactory: async (configService: ConfigService) => {
    const config = configService.get('database');
    return createConnection(config);
  },
  inject: [ConfigService],
};

// 类提供者
const serviceProvider = {
  provide: 'USER_SERVICE',
  useClass: UserService,
};

// 现有提供者
const aliasProvider = {
  provide: 'LEGACY_USER_SERVICE',
  useExisting: UserService,
};

@Module({
  providers: [
    configProvider,
    databaseProvider,
    serviceProvider,
    aliasProvider,
  ],
})
export class AppModule {}
```

### 条件注入

```typescript
@Injectable()
export class NotificationService {
  constructor(
    @Inject('EMAIL_SERVICE')
    private readonly emailService: EmailService,
    @Optional()
    @Inject('SMS_SERVICE')
    private readonly smsService?: SmsService,
  ) {}

  async sendNotification(message: string, type: 'email' | 'sms') {
    if (type === 'email') {
      return this.emailService.send(message);
    }
    
    if (type === 'sms' && this.smsService) {
      return this.smsService.send(message);
    }
    
    throw new Error('不支持的通知类型');
  }
}
```

## ✅ 数据验证和转换

### DTO 设计最佳实践

```typescript
import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  IsInt, 
  Min, 
  Max,
  IsEnum,
  ValidateNested,
  Transform,
  Type,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

export class CreateUserDto {
  @ApiProperty({
    description: '用户名',
    example: 'john_doe',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @Transform(({ value }) => value.trim().toLowerCase())
  username: string;

  @ApiProperty({
    description: '邮箱地址',
    example: 'john@example.com',
  })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({
    description: '年龄',
    example: 25,
    minimum: 18,
    maximum: 100,
  })
  @IsInt()
  @Min(18)
  @Max(100)
  @Type(() => Number)
  age: number;

  @ApiPropertyOptional({
    description: '用户角色',
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.USER;

  @ApiPropertyOptional({
    description: '用户配置',
    type: 'object',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserConfigDto)
  config?: UserConfigDto;
}

export class UserConfigDto {
  @ApiPropertyOptional({
    description: '是否接收邮件通知',
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  emailNotifications?: boolean = true;

  @ApiPropertyOptional({
    description: '主题偏好',
    enum: ['light', 'dark'],
    default: 'light',
  })
  @IsOptional()
  @IsEnum(['light', 'dark'])
  theme?: 'light' | 'dark' = 'light';
}

// 更新 DTO 继承创建 DTO
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: '用户ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}
```

### 自定义验证器

```typescript
import { 
  registerDecorator, 
  ValidationOptions, 
  ValidatorConstraint, 
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

// 自定义验证约束
@ValidatorConstraint({ name: 'isUniqueEmail', async: true })
export class IsUniqueEmailConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(email: string, args: ValidationArguments) {
    const user = await this.userService.findByEmail(email);
    return !user;
  }

  defaultMessage(args: ValidationArguments) {
    return '邮箱地址已存在';
  }
}

// 自定义装饰器
export function IsUniqueEmail(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueEmailConstraint,
    });
  };
}

// 使用自定义验证器
export class CreateUserDto {
  @IsEmail()
  @IsUniqueEmail({
    message: '该邮箱已被注册',
  })
  email: string;
}
```

## 🚨 错误处理和日志

### 全局异常过滤器

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let details: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        message = (exceptionResponse as any).message || exception.message;
        details = (exceptionResponse as any).details;
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = '服务器内部错误';
      
      // 记录未知错误
      this.logger.error(
        `未处理的异常: ${exception}`,
        exception instanceof Error ? exception.stack : undefined,
        'GlobalExceptionFilter',
      );
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(details && { details }),
      ...(process.env.NODE_ENV === 'development' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    };

    // 记录错误日志
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      JSON.stringify(errorResponse),
    );

    response.status(status).json(errorResponse);
  }
}
```

### 自定义异常类

```typescript
import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(
    message: string,
    code?: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(
      {
        message,
        code,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}

export class UserNotFoundException extends BusinessException {
  constructor(userId: number) {
    super(`用户 ID ${userId} 不存在`, 'USER_NOT_FOUND', HttpStatus.NOT_FOUND);
  }
}

export class EmailAlreadyExistsException extends BusinessException {
  constructor(email: string) {
    super(`邮箱 ${email} 已存在`, 'EMAIL_EXISTS', HttpStatus.CONFLICT);
  }
}

// 使用示例
@Injectable()
export class UserService {
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new UserNotFoundException(id);
    }
    
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new EmailAlreadyExistsException(createUserDto.email);
    }

    return this.userRepository.save(createUserDto);
  }
}
```

### 结构化日志

```typescript
import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomLogger implements LoggerService {
  private readonly logger = new Logger(CustomLogger.name);
  private readonly isProduction: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isProduction = this.configService.get('NODE_ENV') === 'production';
  }

  log(message: string, context?: string, meta?: any) {
    const logData = this.formatLog('info', message, context, meta);
    this.logger.log(JSON.stringify(logData));
  }

  error(message: string, trace?: string, context?: string, meta?: any) {
    const logData = this.formatLog('error', message, context, meta, trace);
    this.logger.error(JSON.stringify(logData));
  }

  warn(message: string, context?: string, meta?: any) {
    const logData = this.formatLog('warn', message, context, meta);
    this.logger.warn(JSON.stringify(logData));
  }

  debug(message: string, context?: string, meta?: any) {
    if (!this.isProduction) {
      const logData = this.formatLog('debug', message, context, meta);
      this.logger.debug(JSON.stringify(logData));
    }
  }

  verbose(message: string, context?: string, meta?: any) {
    if (!this.isProduction) {
      const logData = this.formatLog('verbose', message, context, meta);
      this.logger.verbose(JSON.stringify(logData));
    }
  }

  private formatLog(
    level: string,
    message: string,
    context?: string,
    meta?: any,
    trace?: string,
  ) {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      ...(meta && { meta }),
      ...(trace && { trace }),
      pid: process.pid,
      environment: this.configService.get('NODE_ENV'),
    };
  }
}

// 使用示例
@Injectable()
export class UserService {
  constructor(private readonly logger: CustomLogger) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log('开始创建用户', 'UserService', {
      email: createUserDto.email,
      username: createUserDto.username,
    });

    try {
      const user = await this.userRepository.save(createUserDto);
      
      this.logger.log('用户创建成功', 'UserService', {
        userId: user.id,
        email: user.email,
      });

      return user;
    } catch (error) {
      this.logger.error('用户创建失败', error.stack, 'UserService', {
        email: createUserDto.email,
        error: error.message,
      });
      
      throw error;
    }
  }
}
```

## ⚡ 性能优化

### 缓存策略

```typescript
import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly userRepository: UserRepository,
  ) {}

  async findById(id: number): Promise<User> {
    const cacheKey = `user:${id}`;
    
    // 尝试从缓存获取
    let user = await this.cacheManager.get<User>(cacheKey);
    
    if (!user) {
      // 缓存未命中，从数据库查询
      user = await this.userRepository.findOne({ where: { id } });
      
      if (user) {
        // 缓存用户数据，TTL 5分钟
        await this.cacheManager.set(cacheKey, user, 300);
      }
    }
    
    return user;
  }

  async updateUser(id: number, updateData: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.update(id, updateData);
    
    // 更新后清除缓存
    await this.cacheManager.del(`user:${id}`);
    
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
    
    // 删除后清除缓存
    await this.cacheManager.del(`user:${id}`);
  }
}

// 缓存装饰器
export function CacheResult(ttl: number = 300) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`;
      const cacheManager = this.cacheManager;
      
      let result = await cacheManager.get(cacheKey);
      
      if (!result) {
        result = await method.apply(this, args);
        await cacheManager.set(cacheKey, result, ttl);
      }
      
      return result;
    };
  };
}

// 使用缓存装饰器
@Injectable()
export class PostService {
  @CacheResult(600) // 缓存10分钟
  async getPopularPosts(): Promise<Post[]> {
    return this.postRepository.find({
      where: { isPublished: true },
      order: { viewCount: 'DESC' },
      take: 10,
    });
  }
}
```

### 数据库优化

```typescript
// 查询优化
@Injectable()
export class UserService {
  // ✅ 使用索引字段查询
  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email }, // email 字段应该有索引
      select: ['id', 'email', 'username'], // 只选择需要的字段
    });
  }

  // ✅ 批量查询
  async findByIds(ids: number[]): Promise<User[]> {
    return this.userRepository.findByIds(ids, {
      select: ['id', 'email', 'username'],
    });
  }

  // ✅ 分页查询
  async findWithPagination(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { users, total };
  }

  // ✅ 关联查询优化
  async findWithPosts(userId: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['posts'],
      select: {
        id: true,
        username: true,
        email: true,
        posts: {
          id: true,
          title: true,
          createdAt: true,
        },
      },
    });
  }

  // ❌ 避免 N+1 查询问题
  async getBadUserPosts(): Promise<any[]> {
    const users = await this.userRepository.find();
    
    // 这会导致 N+1 查询问题
    const usersWithPosts = await Promise.all(
      users.map(async (user) => ({
        ...user,
        posts: await this.postRepository.find({ where: { userId: user.id } }),
      })),
    );
    
    return usersWithPosts;
  }

  // ✅ 正确的关联查询
  async getGoodUserPosts(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['posts'],
      select: {
        id: true,
        username: true,
        posts: {
          id: true,
          title: true,
        },
      },
    });
  }
}
```

### 响应优化

```typescript
// 响应转换拦截器
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // 移除敏感字段
        if (data && typeof data === 'object') {
          return this.sanitizeResponse(data);
        }
        return data;
      }),
    );
  }

  private sanitizeResponse(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeResponse(item));
    }

    if (data && typeof data === 'object') {
      const sanitized = { ...data };
      
      // 移除敏感字段
      delete sanitized.password;
      delete sanitized.passwordHash;
      delete sanitized.salt;
      delete sanitized.resetToken;
      
      // 递归处理嵌套对象
      Object.keys(sanitized).forEach((key) => {
        if (sanitized[key] && typeof sanitized[key] === 'object') {
          sanitized[key] = this.sanitizeResponse(sanitized[key]);
        }
      });
      
      return sanitized;
    }

    return data;
  }
}

// 压缩大响应
@Injectable()
export class CompressionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    
    return next.handle().pipe(
      map((data) => {
        // 对大响应启用压缩
        const dataSize = JSON.stringify(data).length;
        if (dataSize > 1024) { // 大于 1KB
          response.setHeader('Content-Encoding', 'gzip');
        }
        
        return data;
      }),
    );
  }
}
```

## 🔒 安全最佳实践

### 认证和授权

```typescript
// JWT 策略
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findById(payload.sub);
    
    if (!user || !user.isActive) {
      throw new UnauthorizedException('用户不存在或已被禁用');
    }
    
    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}

// 角色守卫
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

// 角色装饰器
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// 使用示例
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get('users')
  @Roles('admin', 'moderator')
  async getUsers() {
    // 只有管理员和版主可以访问
  }

  @Delete('users/:id')
  @Roles('admin')
  async deleteUser(@Param('id') id: number) {
    // 只有管理员可以删除用户
  }
}
```

### 输入验证和清理

```typescript
// 输入清理管道
@Injectable()
export class SanitizationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      // 移除 HTML 标签
      value = value.replace(/<[^>]*>/g, '');
      
      // 移除 SQL 注入关键字
      const sqlKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'UNION'];
      sqlKeywords.forEach((keyword) => {
        const regex = new RegExp(keyword, 'gi');
        value = value.replace(regex, '');
      });
      
      // 转义特殊字符
      value = value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    }

    if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach((key) => {
        value[key] = this.transform(value[key], metadata);
      });
    }

    return value;
  }
}

// 速率限制
@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): string {
    // 基于用户 ID 或 IP 地址限制
    return req.user?.id || req.ip;
  }

  protected generateKey(context: ExecutionContext, tracker: string): string {
    const request = context.switchToHttp().getRequest();
    const route = request.route?.path || request.url;
    
    return `${tracker}-${route}`;
  }
}

// 使用示例
@Controller('api')
@UseGuards(CustomThrottlerGuard)
@Throttle(100, 60) // 每分钟最多 100 次请求
export class ApiController {
  @Post('login')
  @Throttle(5, 60) // 登录接口每分钟最多 5 次
  @UsePipes(new SanitizationPipe())
  async login(@Body() loginDto: LoginDto) {
    // 登录逻辑
  }
}
```

## 🧪 测试策略

### 单元测试

```typescript
// 服务单元测试
describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findById', () => {
    it('应该返回用户', async () => {
      const user = { id: 1, email: 'test@example.com' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(user as User);

      const result = await service.findById(1);

      expect(result).toEqual(user);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('用户不存在时应该抛出异常', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(UserNotFoundException);
    });
  });

  describe('createUser', () => {
    it('应该创建新用户', async () => {
      const createUserDto = {
        email: 'new@example.com',
        username: 'newuser',
        password: 'password123',
      };
      const savedUser = { id: 1, ...createUserDto };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue(savedUser as User);

      const result = await service.createUser(createUserDto);

      expect(result).toEqual(savedUser);
      expect(repository.save).toHaveBeenCalledWith(createUserDto);
    });

    it('邮箱已存在时应该抛出异常', async () => {
      const createUserDto = {
        email: 'existing@example.com',
        username: 'user',
        password: 'password123',
      };
      const existingUser = { id: 1, email: 'existing@example.com' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingUser as User);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        EmailAlreadyExistsException,
      );
    });
  });
});
```

### 集成测试

```typescript
// 控制器集成测试
describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UserService)
      .useValue({
        findAll: jest.fn(),
        findById: jest.fn(),
        createUser: jest.fn(),
        updateUser: jest.fn(),
        deleteUser: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    userService = moduleFixture.get<UserService>(UserService);
    
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/users (GET)', () => {
    it('应该返回用户列表', () => {
      const users = [
        { id: 1, email: 'user1@example.com' },
        { id: 2, email: 'user2@example.com' },
      ];

      jest.spyOn(userService, 'findAll').mockResolvedValue(users);

      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect(users);
    });
  });

  describe('/users (POST)', () => {
    it('应该创建新用户', () => {
      const createUserDto = {
        email: 'new@example.com',
        username: 'newuser',
        password: 'password123',
      };
      const createdUser = { id: 1, ...createUserDto };

      jest.spyOn(userService, 'createUser').mockResolvedValue(createdUser);

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201)
        .expect(createdUser);
    });

    it('无效数据应该返回 400', () => {
      const invalidDto = {
        email: 'invalid-email',
        username: '',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(invalidDto)
        .expect(400);
    });
  });
});
```

### 测试数据库

```typescript
// 测试数据库配置
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'sqlite',
        database: ':memory:',
        entities: [User, Post],
        synchronize: true,
        logging: false,
      }),
    }),
    TypeOrmModule.forFeature([User, Post]),
  ],
  providers: [UserService, PostService],
})
export class TestDatabaseModule {}

// 数据库测试工具
export class DatabaseTestUtils {
  static async cleanDatabase(connection: Connection): Promise<void> {
    const entities = connection.entityMetadatas;
    
    for (const entity of entities) {
      const repository = connection.getRepository(entity.name);
      await repository.clear();
    }
  }

  static async seedUsers(repository: Repository<User>): Promise<User[]> {
    const users = [
      { email: 'user1@example.com', username: 'user1' },
      { email: 'user2@example.com', username: 'user2' },
    ];

    return repository.save(users);
  }
}

// 使用测试工具
describe('UserService (Database)', () => {
  let service: UserService;
  let connection: Connection;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestDatabaseModule],
    }).compile();

    service = module.get<UserService>(UserService);
    connection = module.get<Connection>(Connection);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    await DatabaseTestUtils.cleanDatabase(connection);
  });

  afterEach(async () => {
    await DatabaseTestUtils.cleanDatabase(connection);
  });

  it('应该从数据库查询用户', async () => {
    const [user1] = await DatabaseTestUtils.seedUsers(userRepository);

    const result = await service.findById(user1.id);

    expect(result.id).toBe(user1.id);
    expect(result.email).toBe(user1.email);
  });
});
```

## 🚀 部署和运维

### Docker 配置

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
COPY yarn.lock ./

# 安装依赖
RUN yarn install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN yarn build

# 生产镜像
FROM node:18-alpine AS production

WORKDIR /app

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# 复制依赖文件
COPY package*.json ./
COPY yarn.lock ./

# 只安装生产依赖
RUN yarn install --frozen-lockfile --production && yarn cache clean

# 复制构建产物
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# 切换到非 root 用户
USER nestjs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# 启动应用
CMD ["node", "dist/main"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      target: production
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/nestjs_app
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: unless-stopped
    networks:
      - app-network

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=nestjs_app
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

### 环境配置

```typescript
// config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'nestjs_app',
    ssl: process.env.DATABASE_SSL === 'true',
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  },
  app: {
    name: process.env.APP_NAME || 'NestJS App',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
  },
});

// 配置验证
import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
});
```

## 📊 监控和调试

### 健康检查

```typescript
// health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // 数据库健康检查
      () => this.db.pingCheck('database'),
      
      // 内存使用检查
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      
      // 磁盘空间检查
      () => this.disk.checkStorage('storage', {
        path: '/',
        thresholdPercent: 0.9,
      }),
    ]);
  }

  @Get('ready')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }

  @Get('live')
  @HealthCheck()
  liveness() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
    ]);
  }
}
```

### 性能监控

```typescript
// monitoring/performance.interceptor.ts
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // 记录慢查询
        if (duration > 1000) {
          this.logger.warn(`慢请求: ${method} ${url} - ${duration}ms`);
        }

        // 发送性能指标到监控系统
        this.sendMetrics({
          method,
          url,
          duration,
          timestamp: startTime,
        });
      }),
      catchError((error) => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        this.logger.error(`请求失败: ${method} ${url} - ${duration}ms`, error.stack);
        
        throw error;
      }),
    );
  }

  private sendMetrics(metrics: any) {
    // 发送到 Prometheus、DataDog 等监控系统
    // 这里可以集成具体的监控服务
  }
}

// 应用性能监控
@Injectable()
export class AppMetricsService {
  private readonly httpRequestDuration = new Map<string, number[]>();
  private readonly httpRequestCount = new Map<string, number>();

  recordHttpRequest(method: string, route: string, duration: number) {
    const key = `${method}:${route}`;
    
    // 记录请求次数
    this.httpRequestCount.set(key, (this.httpRequestCount.get(key) || 0) + 1);
    
    // 记录响应时间
    if (!this.httpRequestDuration.has(key)) {
      this.httpRequestDuration.set(key, []);
    }
    this.httpRequestDuration.get(key).push(duration);
  }

  getMetrics() {
    const metrics = {
      requests: {},
      performance: {},
      system: {
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        cpu: process.cpuUsage(),
      },
    };

    // 请求统计
    for (const [key, count] of this.httpRequestCount.entries()) {
      metrics.requests[key] = { count };
    }

    // 性能统计
    for (const [key, durations] of this.httpRequestDuration.entries()) {
      const sorted = durations.sort((a, b) => a - b);
      metrics.performance[key] = {
        avg: durations.reduce((a, b) => a + b, 0) / durations.length,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        p50: sorted[Math.floor(sorted.length * 0.5)],
        p95: sorted[Math.floor(sorted.length * 0.95)],
        p99: sorted[Math.floor(sorted.length * 0.99)],
      };
    }

    return metrics;
  }
}
```

### 调试工具

```typescript
// debugging/debug.module.ts
@Module({
  providers: [
    {
      provide: 'DEBUG_ENABLED',
      useValue: process.env.NODE_ENV === 'development',
    },
  ],
  exports: ['DEBUG_ENABLED'],
})
export class DebugModule {}

// debugging/debug.decorator.ts
export function Debug(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const isDebugEnabled = this.debugEnabled || process.env.NODE_ENV === 'development';
    
    if (isDebugEnabled) {
      console.log(`🐛 [DEBUG] 调用方法: ${target.constructor.name}.${propertyName}`);
      console.log(`🐛 [DEBUG] 参数:`, args);
      
      const startTime = Date.now();
      
      try {
        const result = await method.apply(this, args);
        const endTime = Date.now();
        
        console.log(`🐛 [DEBUG] 返回结果:`, result);
        console.log(`🐛 [DEBUG] 执行时间: ${endTime - startTime}ms`);
        
        return result;
      } catch (error) {
        const endTime = Date.now();
        
        console.log(`🐛 [DEBUG] 执行错误:`, error);
        console.log(`🐛 [DEBUG] 执行时间: ${endTime - startTime}ms`);
        
        throw error;
      }
    } else {
      return method.apply(this, args);
    }
  };
}

// 使用调试装饰器
@Injectable()
export class UserService {
  @Debug
  async findById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  @Debug
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save(createUserDto);
  }
}
```

## 📝 总结

这份 NestJS 最佳实践指南涵盖了从项目结构到生产部署的各个方面。遵循这些实践可以帮助你：

1. **构建可维护的代码架构**
2. **提高应用性能和安全性**
3. **简化测试和调试过程**
4. **优化部署和运维流程**
5. **建立完善的监控体系**

记住，最佳实践不是一成不变的，需要根据具体项目需求和团队情况进行调整。重要的是保持代码的一致性、可读性和可维护性。