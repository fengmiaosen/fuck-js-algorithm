# React 状态管理方案对比

## 1. Context API

### 特点

- **React 内置**：无需额外依赖
- **简单易用**：API 简洁，学习成本低
- **性能问题**：Provider 值变化会导致所有消费者重渲染
- **适合轻量级**：适合简单的状态共享

### 适用场景
- 主题切换、语言国际化
- 用户认证状态
- 简单的全局配置

### 基础示例
```javascript
// 创建 Context
const ThemeContext = createContext();

// Provider 组件
function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Header />
    </ThemeContext.Provider>
  );
}

// 消费 Context
function Header() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      切换主题: {theme}
    </button>
  );
}
```

---

## 2. Redux

### 特点

- **可预测性**：单一数据源，状态变化可追踪
- **时间旅行**：支持状态回溯和调试
- **样板代码多**：需要 actions、reducers、store
- **学习成本高**：概念较多，需要理解函数式编程思想
- **生态丰富**：中间件、开发工具完善

### 适用场景

- 大型复杂应用
- 需要状态持久化
- 多人协作开发
- 需要详细的状态调试

### 基础示例
```javascript
// Redux Toolkit 简化写法
import { createSlice, configureStore } from '@reduxjs/toolkit';

// 创建 slice
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    }
  }
});

// 组件中使用
function Counter() {
  const count = useSelector(state => state.counter.value);
  const dispatch = useDispatch();
  
  return (
    <div>
      <span>{count}</span>
      <button onClick={() => dispatch(counterSlice.actions.increment())}>
        +1
      </button>
    </div>
  );
}
```

---

## 3. Zustand

### 特点

- **轻量简洁**：包体积小，API 简单
- **无样板代码**：直接定义 store，无需 reducers、actions 等
  -  Zustand 可以天然支持多 store，而 Redux 更强调单一全局 store。
- **TypeScript 友好**：类型推断良好
- **灵活性高**：支持多种使用模式
- **性能优秀**：精确订阅，避免不必要渲染

### 适用场景

- 中小型应用
- 需要快速开发
- 追求简洁的代码风格
- TypeScript 项目

### 基础示例
```javascript
import { create } from 'zustand';

// 创建 store
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 }))
}));

// 组件中使用
function Counter() {
  const { count, increment, decrement } = useStore();
  
  return (
    <div>
      <span>{count}</span>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </div>
  );
}

// 选择性订阅，优化性能
function CountDisplay() {
  const count = useStore(state => state.count);
  return <span>Count: {count}</span>;
}
```

---

## 4. Jotai

### 特点

- **原子化状态**：将状态拆分为独立的原子，每个原子都有自己的状态和更新逻辑
- **自下而上**：从组件需求出发构建状态，避免了 Redux 中的“状态提升”问题
- **无样板代码**：声明式的状态定义，无需编写 action、reducer 等
- **细粒度更新**：只有使用的组件会重渲染，避免了 Context 中的全局重渲染问题
- **组合性强**：原子可以组合派生新状态，实现复杂的状态逻辑

### 适用场景

- 复杂的状态依赖关系
- 需要细粒度性能优化
- 组件状态较为独立
- 函数式编程风格

### 基础示例

```javascript
import { atom, useAtom } from 'jotai';

// 定义原子
const countAtom = atom(0);
const doubleCountAtom = atom((get) => get(countAtom) * 2);

// 组件中使用
function Counter() {
  const [count, setCount] = useAtom(countAtom);
  
  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  );
}

function DoubleCounter() {
  const [doubleCount] = useAtom(doubleCountAtom);
  return <span>Double: {doubleCount}</span>;
}
```

---

## 方案对比总结

| 特性 | Context | Redux | Zustand | Jotai |
|------|---------|-------|---------|-------|
| **学习成本** | 低 | 高 | 低 | 中 |
| **样板代码** | 少 | 多 | 很少 | 很少 |
| **包体积** | 0 | 大 | 小 | 小 |
| **性能** | 一般 | 好 | 很好 | 很好 |
| **调试工具** | 基础 | 强大 | 好 | 好 |
| **TypeScript** | 好 | 好 | 很好 | 很好 |

## 选择建议

### 🎯 **Context API**
- ✅ 简单的全局状态（主题、认证）
- ✅ 小型项目或原型开发
- ❌ 复杂状态逻辑
- ❌ 性能敏感场景

### 🎯 **Redux**
- ✅ 大型企业级应用
- ✅ 需要强大的调试能力
- ✅ 团队协作开发
- ❌ 快速原型开发
- ❌ 简单状态管理

### 🎯 **Zustand**
- ✅ 中小型项目
- ✅ 追求开发效率
- ✅ TypeScript 项目
- ✅ 需要简洁代码

### 🎯 **Jotai**
- ✅ 复杂状态依赖
- ✅ 细粒度性能优化
- ✅ 函数式编程风格
- ✅ 组件状态相对独立

## 实际项目选择策略

1. **小型项目**：Context API + useState
2. **中型项目**：Zustand
3. **大型项目**：Redux Toolkit
4. **复杂状态依赖**：Jotai
5. **混合使用**：Context (全局配置) + Zustand/Jotai (业务状态)

选择状态管理方案时，应该根据项目规模、团队技术栈、性能要求和维护成本来综合考虑。

## 参考

https://react.dev/learn/reacting-to-input-with-state
