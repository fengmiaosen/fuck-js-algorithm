/**
 * NestJS 基础控制器示例
 * 展示了控制器、装饰器、DTO、验证等核心功能
 * 注意：这是一个演示文件，实际使用需要安装 @nestjs/common 等依赖
 */

// 类型定义
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  createdAt: Date;
}

interface CreateUserDto {
  name: string;
  email: string;
  age: number;
}

interface UpdateUserDto {
  name?: string;
  email?: string;
  age?: number;
}

/**
 * 用户控制器示例
 * 在真实项目中，需要使用以下装饰器：
 * 
 * @Controller('users')
 * @ApiTags('用户管理')
 * export class UserController {
 *   
 *   @Get()
 *   @ApiOperation({ summary: '获取所有用户' })
 *   async findAll(@Query('page') page = 1) {
 *     // 实现逻辑
 *   }
 * 
 *   @Post()
 *   @ApiOperation({ summary: '创建用户' })
 *   async create(@Body() createUserDto: CreateUserDto) {
 *     // 实现逻辑
 *   }
 * }
 */
class UserController {
  private users: User[];

  constructor() {
    this.users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        createdAt: new Date()
      }
    ];
  }

  // GET /users - 获取所有用户
  async findAll(page = 1, limit = 10) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return this.users.slice(startIndex, endIndex);
  }

  // GET /users/:id - 根据ID获取用户
  async findOne(id) {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return user;
  }

  // POST /users - 创建新用户
  async create(createUserDto) {
    const newUser = {
      id: this.users.length + 1,
      ...createUserDto,
      createdAt: new Date()
    };
    
    this.users.push(newUser);
    return newUser;
  }

  // PUT /users/:id - 更新用户
  async update(id, updateUserDto) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error(`User with ID ${id} not found`);
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto
    };

    return this.users[userIndex];
  }

  // DELETE /users/:id - 删除用户
  async remove(id) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error(`User with ID ${id} not found`);
    }

    this.users.splice(userIndex, 1);
    return { message: `User with ID ${id} has been deleted` };
  }

  // GET /users/search - 搜索用户
  async search(query) {
    return this.users.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
  }
}

// 演示用法
async function demonstrateController() {
  const controller = new UserController();

  console.log('=== NestJS 控制器演示 ===\n');

  // 1. 获取所有用户
  console.log('1. 获取所有用户:');
  const allUsers = await controller.findAll();
  console.log(JSON.stringify(allUsers, null, 2));

  // 2. 创建新用户
  console.log('\n2. 创建新用户:');
  const newUser = await controller.create({
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 25
  });
  console.log(JSON.stringify(newUser, null, 2));

  // 3. 根据ID获取用户
  console.log('\n3. 根据ID获取用户:');
  const user = await controller.findOne(1);
  console.log(JSON.stringify(user, null, 2));

  // 4. 更新用户
  console.log('\n4. 更新用户:');
  const updatedUser = await controller.update(1, { age: 31 });
  console.log(JSON.stringify(updatedUser, null, 2));

  // 5. 搜索用户
  console.log('\n5. 搜索用户:');
  const searchResults = await controller.search('jane');
  console.log(JSON.stringify(searchResults, null, 2));

  console.log('\n=== NestJS 装饰器说明 ===');
  console.log(`
在真实的 NestJS 项目中，控制器会使用以下装饰器：

1. @Controller('users') - 定义控制器路由前缀
2. @Get(), @Post(), @Put(), @Delete() - 定义HTTP方法
3. @Body() - 获取请求体数据
4. @Param('id') - 获取路由参数
5. @Query() - 获取查询参数
6. @ApiTags() - Swagger文档标签
7. @ApiOperation() - API操作描述
8. @ApiResponse() - API响应描述

示例代码结构：
@Controller('users')
@ApiTags('用户管理')
export class UserController {
  @Get()
  @ApiOperation({ summary: '获取用户列表' })
  async findAll(@Query('page') page) {
    return this.userService.findAll(page);
  }

  @Post()
  @ApiOperation({ summary: '创建用户' })
  async create(@Body() createUserDto) {
    return this.userService.create(createUserDto);
  }
}
  `);
}

// 导出控制器类和演示函数
module.exports = { UserController, demonstrateController };

// 如果直接运行此文件，执行演示
if (require.main === module) {
  demonstrateController().catch(console.error);
}