// 注意：需要先安装依赖 npm install bcryptjs @types/bcryptjs
// import * as bcrypt from 'bcryptjs'

// 占位符实现，实际使用时需要安装依赖
const bcrypt = {
  hash: async (password: string, rounds: number) => `hashed_${password}`,
  compare: async (password: string, hash: string) => password === hash.replace('hashed_', '')
}

import prisma from '../lib/prisma'

export interface CreateUserData {
  email: string
  username: string
  password: string
  firstName?: string
  lastName?: string
  bio?: string
}

export interface UpdateUserData {
  firstName?: string
  lastName?: string
  bio?: string
  avatar?: string
}

export interface UserWithProfile {
  id: string
  email: string
  username: string
  firstName: string | null
  lastName: string | null
  bio: string | null
  avatar: string | null
  isActive: boolean
  role: string
  createdAt: Date
  updatedAt: Date
  lastLogin: Date | null
  profile: {
    website: string | null
    location: string | null
    socialLinks: any
  } | null
  _count: {
    posts: number
    followers: number
    follows: number
  }
}

export class UserService {
  /**
   * 创建新用户
   */
  static async createUser(data: CreateUserData) {
    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username }
        ]
      }
    })

    if (existingUser) {
      throw new Error('邮箱或用户名已存在')
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(data.password, 12)

    // 创建用户（使用事务确保数据一致性）
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          username: data.username,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          bio: data.bio,
          profile: {
            create: {
              preferences: {
                theme: 'light',
                notifications: true
              }
            }
          }
        },
        include: {
          profile: true,
          _count: {
            select: {
              posts: true,
              followers: true,
              follows: true
            }
          }
        }
      })

      // 记录审计日志
      await tx.auditLog.create({
        data: {
          action: 'CREATE',
          table: 'users',
          recordId: newUser.id,
          newData: {
            email: newUser.email,
            username: newUser.username
          }
        }
      })

      return newUser
    })

    // 移除密码字段
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  /**
   * 根据ID获取用户详情
   */
  static async getUserById(id: string): Promise<UserWithProfile | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          select: {
            website: true,
            location: true,
            socialLinks: true
          }
        },
        _count: {
          select: {
            posts: true,
            followers: true,
            follows: true
          }
        }
      }
    })

    if (!user) return null

    // 移除密码字段
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword as UserWithProfile
  }

  /**
   * 根据邮箱获取用户（用于登录）
   */
  static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true
      }
    })
  }

  /**
   * 验证用户密码
   */
  static async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }

  /**
   * 更新用户信息
   */
  static async updateUser(id: string, data: UpdateUserData) {
    const user = await prisma.$transaction(async (tx) => {
      // 获取旧数据用于审计
      const oldUser = await tx.user.findUnique({
        where: { id },
        select: {
          firstName: true,
          lastName: true,
          bio: true,
          avatar: true
        }
      })

      // 更新用户
      const updatedUser = await tx.user.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        },
        include: {
          profile: true,
          _count: {
            select: {
              posts: true,
              followers: true,
              follows: true
            }
          }
        }
      })

      // 记录审计日志
      await tx.auditLog.create({
        data: {
          action: 'UPDATE',
          table: 'users',
          recordId: id,
          oldData: oldUser,
          newData: data,
          userId: id
        }
      })

      return updatedUser
    })

    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  /**
   * 更新用户资料
   */
  static async updateProfile(userId: string, profileData: {
    website?: string
    location?: string
    phoneNumber?: string
    socialLinks?: any
    preferences?: any
  }) {
    return await prisma.profile.upsert({
      where: { userId },
      update: {
        ...profileData,
        updatedAt: new Date()
      },
      create: {
        userId,
        ...profileData
      }
    })
  }

  /**
   * 获取用户列表（分页）
   */
  static async getUsers(options: {
    page?: number
    limit?: number
    search?: string
    role?: string
    isActive?: boolean
  } = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      isActive
    } = options

    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}
    
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (role) {
      where.role = role
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive
    }

    // 并行执行查询和计数
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
          avatar: true,
          role: true,
          isActive: true,
          createdAt: true,
          lastLogin: true,
          _count: {
            select: {
              posts: true,
              followers: true
            }
          }
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

  /**
   * 关注用户
   */
  static async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new Error('不能关注自己')
    }

    // 检查是否已经关注
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    })

    if (existingFollow) {
      throw new Error('已经关注了该用户')
    }

    return await prisma.follow.create({
      data: {
        followerId,
        followingId
      },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    })
  }

  /**
   * 取消关注用户
   */
  static async unfollowUser(followerId: string, followingId: string) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    })

    if (!follow) {
      throw new Error('未关注该用户')
    }

    return await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    })
  }

  /**
   * 获取用户的关注列表
   */
  static async getUserFollows(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit

    const [follows, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followerId: userId },
        skip,
        take: limit,
        include: {
          following: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
              bio: true,
              _count: {
                select: {
                  followers: true,
                  posts: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.follow.count({
        where: { followerId: userId }
      })
    ])

    return {
      follows: follows.map(f => f.following),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  /**
   * 获取用户的粉丝列表
   */
  static async getUserFollowers(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit

    const [followers, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followingId: userId },
        skip,
        take: limit,
        include: {
          follower: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
              bio: true,
              _count: {
                select: {
                  followers: true,
                  posts: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.follow.count({
        where: { followingId: userId }
      })
    ])

    return {
      followers: followers.map(f => f.follower),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  /**
   * 更新用户最后登录时间
   */
  static async updateLastLogin(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() }
    })
  }

  /**
   * 软删除用户（设置为非活跃状态）
   */
  static async deactivateUser(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { isActive: false }
    })
  }

  /**
   * 激活用户
   */
  static async activateUser(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { isActive: true }
    })
  }
}