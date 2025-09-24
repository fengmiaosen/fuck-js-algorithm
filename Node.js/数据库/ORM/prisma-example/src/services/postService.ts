import { prisma } from '../lib/prisma'

export interface CreatePostData {
  title: string
  content: string
  excerpt?: string
  coverImage?: string
  categoryId?: string
  tagIds?: string[]
  published?: boolean
}

export interface UpdatePostData {
  title?: string
  content?: string
  excerpt?: string
  coverImage?: string
  categoryId?: string
  tagIds?: string[]
  published?: boolean
}

export interface PostWithDetails {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImage: string | null
  published: boolean
  publishedAt: Date | null
  viewCount: number
  likeCount: number
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    username: string
    firstName: string | null
    lastName: string | null
    avatar: string | null
  }
  category: {
    id: string
    name: string
    slug: string
    color: string | null
  } | null
  tags: Array<{
    id: string
    name: string
    color: string | null
  }>
  _count: {
    comments: number
    likes: number
  }
}

export class PostService {
  /**
   * 创建文章
   */
  static async createPost(authorId: string, data: CreatePostData) {
    // 生成 slug
    const slug = this.generateSlug(data.title)
    
    // 检查 slug 是否已存在
    const existingPost = await prisma.post.findUnique({
      where: { slug }
    })

    if (existingPost) {
      throw new Error('文章标题已存在，请修改标题')
    }

    const post = await prisma.$transaction(async (tx) => {
      // 创建文章
      const newPost = await tx.post.create({
        data: {
          title: data.title,
          slug,
          content: data.content,
          excerpt: data.excerpt,
          coverImage: data.coverImage,
          published: data.published || false,
          publishedAt: data.published ? new Date() : null,
          authorId,
          categoryId: data.categoryId,
          tags: data.tagIds ? {
            create: data.tagIds.map(tagId => ({
              tagId
            }))
          } : undefined
        },
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
          tags: {
            include: {
              tag: true
            }
          },
          _count: {
            select: {
              comments: true,
              likes: true
            }
          }
        }
      })

      // 记录审计日志
      await tx.auditLog.create({
        data: {
          action: 'CREATE',
          table: 'posts',
          recordId: newPost.id,
          newData: {
            title: newPost.title,
            published: newPost.published
          },
          userId: authorId
        }
      })

      return newPost
    })

    // 格式化返回数据
    return {
      ...post,
      tags: post.tags.map(pt => pt.tag)
    }
  }

  /**
   * 根据ID获取文章详情
   */
  static async getPostById(id: string, includeUnpublished = false): Promise<PostWithDetails | null> {
    const whereCondition: any = { id }
    
    if (!includeUnpublished) {
      whereCondition.published = true
    }

    const post = await prisma.post.findFirst({
      where: whereCondition,
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
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true
              }
            }
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      }
    })

    if (!post) return null

    return {
      ...post,
      tags: post.tags.map(pt => pt.tag)
    } as PostWithDetails
  }

  /**
   * 根据 slug 获取文章
   */
  static async getPostBySlug(slug: string, includeUnpublished = false): Promise<PostWithDetails | null> {
    const whereCondition: any = { slug }
    
    if (!includeUnpublished) {
      whereCondition.published = true
    }

    const post = await prisma.post.findFirst({
      where: whereCondition,
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
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true
              }
            }
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      }
    })

    if (!post) return null

    // 增加浏览量
    await prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } }
    })

    return {
      ...post,
      viewCount: post.viewCount + 1,
      tags: post.tags.map(pt => pt.tag)
    } as PostWithDetails
  }

  /**
   * 获取文章列表（分页、筛选、排序）
   */
  static async getPosts(options: {
    page?: number
    limit?: number
    search?: string
    categoryId?: string
    tagId?: string
    authorId?: string
    published?: boolean
    sortBy?: 'latest' | 'popular' | 'mostLiked' | 'mostViewed'
  } = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      tagId,
      authorId,
      published = true,
      sortBy = 'latest'
    } = options

    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = { published }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (tagId) {
      where.tags = {
        some: { tagId }
      }
    }

    if (authorId) {
      where.authorId = authorId
    }

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
      case 'mostViewed':
        orderBy = { viewCount: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // 并行执行查询和计数
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
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true
            }
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  color: true
                }
              }
            }
          },
          _count: {
            select: {
              comments: true,
              likes: true
            }
          }
        }
      }),
      prisma.post.count({ where })
    ])

    return {
      posts: posts.map(post => ({
        ...post,
        tags: post.tags.map(pt => pt.tag)
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  /**
   * 更新文章
   */
  static async updatePost(id: string, authorId: string, data: UpdatePostData) {
    // 检查文章是否存在且属于当前用户
    const existingPost = await prisma.post.findFirst({
      where: { id, authorId }
    })

    if (!existingPost) {
      throw new Error('文章不存在或无权限修改')
    }

    let slug = existingPost.slug
    
    // 如果标题改变，重新生成 slug
    if (data.title && data.title !== existingPost.title) {
      slug = this.generateSlug(data.title)
      
      // 检查新 slug 是否已存在
      const slugExists = await prisma.post.findFirst({
        where: { 
          slug,
          NOT: { id }
        }
      })

      if (slugExists) {
        throw new Error('文章标题已存在，请修改标题')
      }
    }

    const post = await prisma.$transaction(async (tx) => {
      // 如果需要更新标签
      if (data.tagIds !== undefined) {
        // 删除现有标签关联
        await tx.postTag.deleteMany({
          where: { postId: id }
        })

        // 创建新的标签关联
        if (data.tagIds.length > 0) {
          await tx.postTag.createMany({
            data: data.tagIds.map(tagId => ({
              postId: id,
              tagId
            }))
          })
        }
      }

      // 更新文章
      const updatedPost = await tx.post.update({
        where: { id },
        data: {
          title: data.title,
          slug,
          content: data.content,
          excerpt: data.excerpt,
          coverImage: data.coverImage,
          categoryId: data.categoryId,
          published: data.published,
          publishedAt: data.published && !existingPost.published ? new Date() : existingPost.publishedAt,
          updatedAt: new Date()
        },
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
          tags: {
            include: {
              tag: true
            }
          },
          _count: {
            select: {
              comments: true,
              likes: true
            }
          }
        }
      })

      // 记录审计日志
      await tx.auditLog.create({
        data: {
          action: 'UPDATE',
          table: 'posts',
          recordId: id,
          oldData: {
            title: existingPost.title,
            published: existingPost.published
          },
          newData: {
            title: data.title,
            published: data.published
          },
          userId: authorId
        }
      })

      return updatedPost
    })

    return {
      ...post,
      tags: post.tags.map(pt => pt.tag)
    }
  }

  /**
   * 删除文章
   */
  static async deletePost(id: string, authorId: string) {
    // 检查文章是否存在且属于当前用户
    const existingPost = await prisma.post.findFirst({
      where: { id, authorId }
    })

    if (!existingPost) {
      throw new Error('文章不存在或无权限删除')
    }

    return await prisma.$transaction(async (tx) => {
      // 删除相关数据（Prisma 会自动处理级联删除）
      const deletedPost = await tx.post.delete({
        where: { id }
      })

      // 记录审计日志
      await tx.auditLog.create({
        data: {
          action: 'DELETE',
          table: 'posts',
          recordId: id,
          oldData: {
            title: existingPost.title,
            published: existingPost.published
          },
          userId: authorId
        }
      })

      return deletedPost
    })
  }

  /**
   * 点赞文章
   */
  static async likePost(postId: string, userId: string) {
    // 检查是否已经点赞
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    })

    if (existingLike) {
      throw new Error('已经点赞过该文章')
    }

    return await prisma.$transaction(async (tx) => {
      // 创建点赞记录
      const like = await tx.like.create({
        data: {
          userId,
          postId
        }
      })

      // 更新文章点赞数
      await tx.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } }
      })

      return like
    })
  }

  /**
   * 取消点赞文章
   */
  static async unlikePost(postId: string, userId: string) {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    })

    if (!existingLike) {
      throw new Error('未点赞该文章')
    }

    return await prisma.$transaction(async (tx) => {
      // 删除点赞记录
      await tx.like.delete({
        where: {
          userId_postId: {
            userId,
            postId
          }
        }
      })

      // 更新文章点赞数
      await tx.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } }
      })
    })
  }

  /**
   * 获取用户点赞的文章列表
   */
  static async getUserLikedPosts(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit

    const [likes, total] = await Promise.all([
      prisma.like.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          post: {
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
              _count: {
                select: {
                  comments: true,
                  likes: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.like.count({
        where: { userId }
      })
    ])

    return {
      posts: likes.map(like => like.post),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  /**
   * 获取热门文章
   */
  static async getTrendingPosts(limit = 10, days = 7) {
    const dateFrom = new Date()
    dateFrom.setDate(dateFrom.getDate() - days)

    return await prisma.post.findMany({
      where: {
        published: true,
        publishedAt: {
          gte: dateFrom
        }
      },
      take: limit,
      orderBy: [
        { viewCount: 'desc' },
        { likeCount: 'desc' },
        { createdAt: 'desc' }
      ],
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
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      }
    })
  }

  /**
   * 获取相关文章
   */
  static async getRelatedPosts(postId: string, limit = 5) {
    // 获取当前文章的分类和标签
    const currentPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        tags: {
          select: { tagId: true }
        }
      }
    })

    if (!currentPost) return []

    const tagIds = currentPost.tags.map(t => t.tagId)

    return await prisma.post.findMany({
      where: {
        published: true,
        NOT: { id: postId },
        OR: [
          { categoryId: currentPost.categoryId },
          {
            tags: {
              some: {
                tagId: { in: tagIds }
              }
            }
          }
        ]
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
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
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      }
    })
  }

  /**
   * 生成文章 slug
   */
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // 移除特殊字符
      .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
      .replace(/^-+|-+$/g, '') // 移除开头和结尾的连字符
      + '-' + Date.now() // 添加时间戳确保唯一性
  }

  /**
   * 获取文章统计信息
   */
  static async getPostStats(authorId?: string) {
    const where = authorId ? { authorId } : {}

    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      totalLikes
    ] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.count({ where: { ...where, published: true } }),
      prisma.post.count({ where: { ...where, published: false } }),
      prisma.post.aggregate({
        where,
        _sum: { viewCount: true }
      }),
      prisma.post.aggregate({
        where,
        _sum: { likeCount: true }
      })
    ])

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews: totalViews._sum.viewCount || 0,
      totalLikes: totalLikes._sum.likeCount || 0
    }
  }
}