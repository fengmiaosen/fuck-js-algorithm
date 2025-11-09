# Vue 状态管理 - Pinia

## 核心特性

### 1. **简洁的API设计**
- 去除了Vuex的mutations，只保留state、getters、actions
- 支持TypeScript，类型推断完善
- 更直观的状态管理方式

### 2. **模块化架构**
- 每个store都是独立的模块
- 自动代码分割，按需加载
- 避免命名空间冲突

### 3. **开发体验优秀**
- 热重载支持
- 时间旅行调试
- Vue DevTools集成
- 支持插件扩展

### 4. **性能优化**
- 只有使用的store才会被激活
- 细粒度的响应式更新
- 支持SSR

## 基础使用

### 定义Store
```javascript
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Counter'
  }),
  
  getters: {
    doubleCount: (state) => state.count * 2,
    // 支持参数的getter
    getCountPlusOne: (state) => (n) => state.count + n
  },
  
  actions: {
    increment() {
      this.count++
    },
    async fetchData() {
      // 支持异步操作
      const data = await api.getData()
      this.count = data.count
    }
  }
})
```

### 组件中使用
```javascript
// 组合式API
<script setup>
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()

// 直接访问
console.log(counter.count)
console.log(counter.doubleCount)

// 调用actions
counter.increment()
</script>

// 选项式API
<script>
import { mapStores, mapState, mapActions } from 'pinia'
import { useCounterStore } from '@/stores/counter'

export default {
  computed: {
    ...mapStores(useCounterStore),
    ...mapState(useCounterStore, ['count', 'doubleCount'])
  },
  methods: {
    ...mapActions(useCounterStore, ['increment'])
  }
}
</script>
```

## 高级特性

### 1. **Store组合**
```javascript
// 在一个store中使用另一个store
export const useUserStore = defineStore('user', () => {
  const counter = useCounterStore()
  
  const userData = ref({})
  
  function updateUserCount() {
    counter.increment()
  }
  
  return { userData, updateUserCount }
})
```

### 2. **状态持久化**
```javascript
// 使用插件实现持久化
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// store中启用持久化
export const useStore = defineStore('main', {
  state: () => ({ count: 0 }),
  persist: true // 自动持久化到localStorage
})
```

### 3. **订阅状态变化**
```javascript
// 监听store变化
const store = useCounterStore()

store.$subscribe((mutation, state) => {
  console.log('状态变化:', mutation.type, state)
})

// 监听actions
store.$onAction(({ name, args, after, onError }) => {
  console.log(`Action ${name} 被调用，参数:`, args)
  
  after((result) => {
    console.log('Action执行完成，结果:', result)
  })
})
```

## 与Vuex对比

| 特性 | Pinia | Vuex |
|------|-------|------|
| **API复杂度** | 简单 | 复杂 |
| **TypeScript** | 原生支持 | 需要额外配置 |
| **模块化** | 天然支持 | 需要命名空间 |
| **代码分割** | 自动 | 手动 |
| **调试体验** | 优秀 | 良好 |
| **包体积** | 更小 | 较大 |

## 最佳实践

### 1. **Store命名规范**
```javascript
// 使用use开头 + 功能名 + Store结尾
export const useUserStore = defineStore('user', {})
export const useCartStore = defineStore('cart', {})
export const useProductStore = defineStore('product', {})
```

### 2. **状态结构设计**
```javascript
// 保持状态扁平化，避免深层嵌套
export const useUserStore = defineStore('user', {
  state: () => ({
    // 基础数据
    id: null,
    name: '',
    email: '',
    
    // 状态标识
    isLoading: false,
    isLoggedIn: false,
    
    // 列表数据
    permissions: [],
    preferences: {}
  })
})
```

### 3. **Actions设计原则**
```javascript
export const useApiStore = defineStore('api', {
  actions: {
    // 单一职责
    async fetchUser(id) {
      this.isLoading = true
      try {
        const user = await api.getUser(id)
        this.setUser(user)
        return user
      } catch (error) {
        this.handleError(error)
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    // 纯函数操作
    setUser(user) {
      this.id = user.id
      this.name = user.name
      this.email = user.email
    }
  }
})
```

## 总结

**Pinia的核心优势：**
- 🚀 **简洁易用**：API设计直观，学习成本低
- 🔧 **TypeScript友好**：完善的类型支持
- ⚡ **性能优秀**：按需加载，细粒度更新
- 🛠️ **开发体验**：热重载、调试工具完善
- 📦 **轻量级**：包体积小，功能完整

**适用场景：**
- Vue 3项目的首选状态管理方案
- 需要TypeScript支持的项目
- 追求简洁代码风格的团队
- 从Vuex迁移的项目

Pinia是Vue生态系统中现代化的状态管理解决方案，推荐在新项目中使用。

---

**参考链接：** https://pinia.vuejs.org/zh/introduction.html

Pinia 是 Vue 的专属状态管理库，它允许你跨组件或页面共享状态。如果你熟悉组合式 API 的话，你可能会认为可以通过一行简单的 export const state = reactive({}) 来共享一个全局状态。

