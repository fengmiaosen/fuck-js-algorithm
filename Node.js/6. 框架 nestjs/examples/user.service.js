/**
 * NestJS 服务层示例
 * 展示服务的基本用法和依赖注入
 */

// 模拟 NestJS 装饰器和依赖注入
function Injectable() {
  return function(target) {
    target.isInjectable = true;
    return target;
  };
}

function InjectRepository(entity) {
  return function(target, propertyKey, parameterIndex) {
    // 模拟依赖注入标记
    target.injectedRepositories = target.injectedRepositories || [];
    target.injectedRepositories.push({ entity, parameterIndex });
  };
}

// 用户实体类
class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.email = data.email || '';
    this.age = data.age || 0;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // 实体方法
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      age: this.age,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // 验证方法
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim().length === 0) {
      errors.push('姓名不能为空');
    }
    
    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('邮箱格式不正确');
    }
    
    if (this.age < 0 || this.age > 150) {
      errors.push('年龄必须在0-150之间');
    }
    
    return errors;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// 模拟数据库仓库
class UserRepository {
  constructor() {
    // 模拟内存数据库
    this.users = [
      new User({
        id: 1,
        name: '张三',
        email: 'zhangsan@example.com',
        age: 25,
        createdAt: new Date('2023-01-01'),
      }),
      new User({
        id: 2,
        name: '李四',
        email: 'lisi@example.com',
        age: 30,
        createdAt: new Date('2023-01-02'),
      }),
      new User({
        id: 3,
        name: '王五',
        email: 'wangwu@example.com',
        age: 28,
        createdAt: new Date('2023-01-03'),
      }),
    ];
    this.nextId = 4;
  }

  // 查找所有用户
  async find(options = {}) {
    console.log('🗄️ Repository: 查找用户', options);
    
    let result = [...this.users];
    
    // 模拟条件过滤
    if (options.where) {
      result = result.filter(user => {
        return Object.keys(options.where).every(key => {
          return user[key] === options.where[key];
        });
      });
    }
    
    // 模拟排序
    if (options.order) {
      const [field, direction] = Object.entries(options.order)[0];
      result.sort((a, b) => {
        if (direction === 'DESC') {
          return a[field] > b[field] ? -1 : 1;
        }
        return a[field] < b[field] ? -1 : 1;
      });
    }
    
    // 模拟分页
    if (options.skip !== undefined && options.take !== undefined) {
      result = result.slice(options.skip, options.skip + options.take);
    }
    
    return result;
  }

  // 根据ID查找用户
  async findOne(options) {
    console.log('🔍 Repository: 查找单个用户', options);
    
    if (options.where && options.where.id) {
      return this.users.find(user => user.id === options.where.id) || null;
    }
    
    return null;
  }

  // 创建用户
  async save(userData) {
    console.log('💾 Repository: 保存用户', userData);
    
    if (userData.id) {
      // 更新现有用户
      const index = this.users.findIndex(user => user.id === userData.id);
      if (index !== -1) {
        this.users[index] = new User({ ...userData, updatedAt: new Date() });
        return this.users[index];
      }
    } else {
      // 创建新用户
      const newUser = new User({ ...userData, id: this.nextId++, createdAt: new Date() });
      this.users.push(newUser);
      return newUser;
    }
    
    throw new Error('保存用户失败');
  }

  // 删除用户
  async remove(user) {
    console.log('🗑️ Repository: 删除用户', user.id);
    
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      return this.users.splice(index, 1)[0];
    }
    
    throw new Error('用户不存在');
  }

  // 统计用户数量
  async count(options = {}) {
    console.log('📊 Repository: 统计用户数量', options);
    
    if (options.where) {
      return this.users.filter(user => {
        return Object.keys(options.where).every(key => {
          return user[key] === options.where[key];
        });
      }).length;
    }
    
    return this.users.length;
  }
}

/**
 * 用户服务类
 * 处理用户相关的业务逻辑
 */
@Injectable()
class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository || new UserRepository();
    console.log('🏗️ UserService 初始化完成');
  }

  /**
   * 获取所有用户
   */
  async findAll(options = {}) {
    console.log('📋 Service: 获取用户列表', options);
    
    try {
      const { page = 1, limit = 10, search, sortBy = 'id', order = 'ASC' } = options;
      
      // 构建查询选项
      const queryOptions = {
        skip: (page - 1) * limit,
        take: limit,
        order: { [sortBy]: order },
      };
      
      // 如果有搜索条件，先获取所有数据再过滤
      let users;
      if (search) {
        const allUsers = await this.userRepository.find();
        users = allUsers.filter(user => 
          user.name.includes(search) || 
          user.email.includes(search)
        ).slice(queryOptions.skip, queryOptions.skip + queryOptions.take);
      } else {
        users = await this.userRepository.find(queryOptions);
      }
      
      // 获取总数
      const total = search 
        ? (await this.userRepository.find()).filter(user => 
            user.name.includes(search) || user.email.includes(search)
          ).length
        : await this.userRepository.count();
      
      console.log(`✅ Service: 找到 ${users.length} 个用户，总计 ${total} 个`);
      
      return {
        data: users.map(user => user.toJSON()),
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('❌ Service: 获取用户列表失败', error.message);
      throw new Error(`获取用户列表失败: ${error.message}`);
    }
  }

  /**
   * 根据ID获取用户
   */
  async findOne(id) {
    console.log(`👤 Service: 获取用户详情 ID=${id}`);
    
    try {
      if (!id || isNaN(Number(id))) {
        throw new Error('无效的用户ID');
      }
      
      const user = await this.userRepository.findOne({
        where: { id: Number(id) }
      });
      
      if (!user) {
        throw new Error('用户不存在');
      }
      
      console.log('✅ Service: 用户查找成功', user.name);
      return user.toJSON();
    } catch (error) {
      console.error('❌ Service: 获取用户详情失败', error.message);
      throw error;
    }
  }

  /**
   * 创建新用户
   */
  async create(userData) {
    console.log('➕ Service: 创建新用户', userData);
    
    try {
      // 创建用户实例进行验证
      const user = new User(userData);
      const validationErrors = user.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(`数据验证失败: ${validationErrors.join(', ')}`);
      }
      
      // 检查邮箱是否已存在
      const existingUsers = await this.userRepository.find();
      const emailExists = existingUsers.some(u => u.email === userData.email);
      
      if (emailExists) {
        throw new Error('邮箱已被使用');
      }
      
      // 保存用户
      const savedUser = await this.userRepository.save(userData);
      
      console.log('✅ Service: 用户创建成功', savedUser.id);
      return savedUser.toJSON();
    } catch (error) {
      console.error('❌ Service: 创建用户失败', error.message);
      throw error;
    }
  }

  /**
   * 更新用户信息
   */
  async update(id, updateData) {
    console.log(`✏️ Service: 更新用户 ID=${id}`, updateData);
    
    try {
      // 查找现有用户
      const existingUser = await this.userRepository.findOne({
        where: { id: Number(id) }
      });
      
      if (!existingUser) {
        throw new Error('用户不存在');
      }
      
      // 合并更新数据
      const updatedUserData = {
        ...existingUser,
        ...updateData,
        id: Number(id), // 确保ID不被覆盖
        updatedAt: new Date(),
      };
      
      // 验证更新后的数据
      const user = new User(updatedUserData);
      const validationErrors = user.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(`数据验证失败: ${validationErrors.join(', ')}`);
      }
      
      // 如果更新邮箱，检查是否与其他用户冲突
      if (updateData.email && updateData.email !== existingUser.email) {
        const allUsers = await this.userRepository.find();
        const emailExists = allUsers.some(u => u.email === updateData.email && u.id !== Number(id));
        
        if (emailExists) {
          throw new Error('邮箱已被其他用户使用');
        }
      }
      
      // 保存更新
      const updatedUser = await this.userRepository.save(updatedUserData);
      
      console.log('✅ Service: 用户更新成功', updatedUser.id);
      return updatedUser.toJSON();
    } catch (error) {
      console.error('❌ Service: 更新用户失败', error.message);
      throw error;
    }
  }

  /**
   * 删除用户
   */
  async remove(id) {
    console.log(`🗑️ Service: 删除用户 ID=${id}`);
    
    try {
      const user = await this.userRepository.findOne({
        where: { id: Number(id) }
      });
      
      if (!user) {
        throw new Error('用户不存在');
      }
      
      await this.userRepository.remove(user);
      
      console.log('✅ Service: 用户删除成功', id);
      return { message: '用户删除成功', deletedId: Number(id) };
    } catch (error) {
      console.error('❌ Service: 删除用户失败', error.message);
      throw error;
    }
  }

  /**
   * 批量创建用户
   */
  async createBatch(usersData) {
    console.log('📦 Service: 批量创建用户', usersData.length, '个');
    
    try {
      const results = [];
      const errors = [];
      
      for (let i = 0; i < usersData.length; i++) {
        try {
          const user = await this.create(usersData[i]);
          results.push(user);
        } catch (error) {
          errors.push({
            index: i,
            data: usersData[i],
            error: error.message,
          });
        }
      }
      
      console.log(`✅ Service: 批量创建完成，成功 ${results.length} 个，失败 ${errors.length} 个`);
      
      return {
        success: results,
        errors: errors,
        total: usersData.length,
        successCount: results.length,
        errorCount: errors.length,
      };
    } catch (error) {
      console.error('❌ Service: 批量创建失败', error.message);
      throw error;
    }
  }

  /**
   * 获取用户统计信息
   */
  async getStatistics() {
    console.log('📊 Service: 获取用户统计信息');
    
    try {
      const allUsers = await this.userRepository.find();
      const activeUsers = allUsers.filter(user => user.isActive);
      
      // 计算今日新增用户
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const newUsersToday = allUsers.filter(user => 
        user.createdAt >= today
      );
      
      // 计算平均年龄
      const totalAge = allUsers.reduce((sum, user) => sum + user.age, 0);
      const averageAge = allUsers.length > 0 ? totalAge / allUsers.length : 0;
      
      // 年龄分布
      const ageGroups = {
        '18-25': allUsers.filter(u => u.age >= 18 && u.age <= 25).length,
        '26-35': allUsers.filter(u => u.age >= 26 && u.age <= 35).length,
        '36-45': allUsers.filter(u => u.age >= 36 && u.age <= 45).length,
        '46+': allUsers.filter(u => u.age >= 46).length,
      };
      
      const statistics = {
        totalUsers: allUsers.length,
        activeUsers: activeUsers.length,
        inactiveUsers: allUsers.length - activeUsers.length,
        newUsersToday: newUsersToday.length,
        averageAge: Math.round(averageAge * 100) / 100,
        ageDistribution: ageGroups,
        lastUpdated: new Date(),
      };
      
      console.log('✅ Service: 统计信息获取成功', statistics);
      return statistics;
    } catch (error) {
      console.error('❌ Service: 获取统计信息失败', error.message);
      throw error;
    }
  }

  /**
   * 搜索用户
   */
  async searchUsers(searchOptions) {
    console.log('🔍 Service: 搜索用户', searchOptions);
    
    try {
      const { query, type = 'all', minAge, maxAge, isActive } = searchOptions;
      
      const allUsers = await this.userRepository.find();
      
      let filteredUsers = allUsers.filter(user => {
        // 文本搜索
        let textMatch = true;
        if (query) {
          switch (type) {
            case 'name':
              textMatch = user.name.toLowerCase().includes(query.toLowerCase());
              break;
            case 'email':
              textMatch = user.email.toLowerCase().includes(query.toLowerCase());
              break;
            case 'all':
            default:
              textMatch = user.name.toLowerCase().includes(query.toLowerCase()) ||
                         user.email.toLowerCase().includes(query.toLowerCase());
              break;
          }
        }
        
        // 年龄过滤
        let ageMatch = true;
        if (minAge !== undefined) {
          ageMatch = ageMatch && user.age >= minAge;
        }
        if (maxAge !== undefined) {
          ageMatch = ageMatch && user.age <= maxAge;
        }
        
        // 状态过滤
        let statusMatch = true;
        if (isActive !== undefined) {
          statusMatch = user.isActive === isActive;
        }
        
        return textMatch && ageMatch && statusMatch;
      });
      
      console.log(`✅ Service: 搜索完成，找到 ${filteredUsers.length} 个用户`);
      
      return {
        results: filteredUsers.map(user => user.toJSON()),
        total: filteredUsers.length,
        searchCriteria: searchOptions,
      };
    } catch (error) {
      console.error('❌ Service: 搜索用户失败', error.message);
      throw error;
    }
  }

  /**
   * 切换用户状态
   */
  async toggleUserStatus(id) {
    console.log(`🔄 Service: 切换用户状态 ID=${id}`);
    
    try {
      const user = await this.userRepository.findOne({
        where: { id: Number(id) }
      });
      
      if (!user) {
        throw new Error('用户不存在');
      }
      
      const updatedUser = await this.userRepository.save({
        ...user,
        isActive: !user.isActive,
        updatedAt: new Date(),
      });
      
      console.log(`✅ Service: 用户状态切换成功，当前状态: ${updatedUser.isActive ? '激活' : '禁用'}`);
      return updatedUser.toJSON();
    } catch (error) {
      console.error('❌ Service: 切换用户状态失败', error.message);
      throw error;
    }
  }
}

// 导出服务和相关类
module.exports = {
  UserService,
  User,
  UserRepository,
  Injectable,
  InjectRepository,
};

/**
 * 服务层使用说明:
 * 
 * 1. 依赖注入:
 *    - @Injectable(): 标记类为可注入的服务
 *    - @InjectRepository(): 注入数据库仓库
 * 
 * 2. 业务逻辑:
 *    - 数据验证和处理
 *    - 业务规则实现
 *    - 错误处理和日志记录
 * 
 * 3. 数据访问:
 *    - 通过仓库模式访问数据
 *    - 事务处理
 *    - 查询优化
 * 
 * 4. 服务特点:
 *    - 单一职责原则
 *    - 可测试性
 *    - 可复用性
 *    - 松耦合设计
 */