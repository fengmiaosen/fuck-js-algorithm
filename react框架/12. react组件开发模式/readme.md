
React组件开发中有许多常用的设计模式，这些模式帮助我们写出更清晰、可维护和可复用的代码：

**组合模式（Composition Pattern）**
通过组合而不是继承来构建组件，使用children prop和组件嵌套来实现灵活的组件结构。这是React推荐的方式，避免了类继承的复杂性。

```jsx
// Card组件通过children实现组合
function Card({ children, className = "" }) {
  return (
    <div className={`border rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
}

// 使用组合
function App() {
  return (
    <Card className="bg-gray-100">
      <h2>标题</h2>
      <p>这是卡片内容</p>
      <button>操作按钮</button>
    </Card>
  );
}
```

**高阶组件（HOC Pattern）**
高阶组件是一个函数，接收一个组件作为参数并返回一个新组件。常用于横切关注点，如身份验证、日志记录、数据获取等功能的复用。

**Render Props模式**
通过一个值为函数的prop来共享代码，这个函数返回React元素。它提供了一种在组件间共享状态逻辑的灵活方式。

**自定义Hooks模式**
将组件逻辑提取到自定义Hook中，实现状态逻辑的复用。这是现代React开发中最推荐的代码复用方式，比HOC和Render Props更简洁。

```jsx
// 自定义Hook - 计数器逻辑
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
}

// 使用自定义Hook
function Counter() {
  const { count, increment, decrement, reset } = useCounter(0);
  
  return (
    <div className="text-center space-y-2">
      <p className="text-xl">计数: {count}</p>
      <div className="space-x-2">
        <button onClick={increment} className="px-3 py-1 bg-blue-500 text-white rounded">+</button>
        <button onClick={decrement} className="px-3 py-1 bg-red-500 text-white rounded">-</button>
        <button onClick={reset} className="px-3 py-1 bg-gray-500 text-white rounded">重置</button>
      </div>
    </div>
  );
}
```

**容器/展示组件模式**
将组件分为容器组件（负责数据和逻辑）和展示组件（负责UI渲染）。容器组件处理状态管理和副作用，展示组件只关注UI展示。

```jsx
// 展示组件 - 只负责UI渲染
function UserList({ users, onUserClick }) {
  return (
    <div className="space-y-2">
      {users.map(user => (
        <div 
          key={user.id} 
          onClick={() => onUserClick(user)}
          className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
        >
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
        </div>
      ))}
    </div>
  );
}

// 容器组件 - 负责数据和逻辑
function UserContainer() {
  const [users, setUsers] = useState([
    { id: 1, name: '张三', email: 'zhang@example.com' },
    { id: 2, name: '李四', email: 'li@example.com' }
  ]);
  
  const handleUserClick = (user) => {
    alert(`点击了用户: ${user.name}`);
  };
  
  return <UserList users={users} onUserClick={handleUserClick} />;
}
```

**组合组件模式（Compound Components）**
将相关的组件组合在一起，通过React.Children和cloneElement API来实现组件间的通信，常见于导航菜单、选项卡等复合UI组件。

```jsx
// 手风琴组件系统
function Accordion({ children }) {
  const [openIndex, setOpenIndex] = useState(null);
  
  return (
    <div className="border rounded">
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          isOpen: openIndex === index,
          onToggle: () => setOpenIndex(openIndex === index ? null : index)
        })
      )}
    </div>
  );
}

function AccordionItem({ title, children, isOpen, onToggle }) {
  return (
    <div className="border-b last:border-b-0">
      <button 
        onClick={onToggle}
        className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100"
      >
        {title}
      </button>
      {isOpen && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
}

// 使用组合组件
function App() {
  return (
    <Accordion>
      <AccordionItem title="第一项">
        <p>第一项的内容</p>
      </AccordionItem>
      <AccordionItem title="第二项">
        <p>第二项的内容</p>
      </AccordionItem>
    </Accordion>
  );
}
```

**Provider模式**
使用React Context API创建Provider组件，向组件树中的任何层级提供数据，避免props drilling问题。

```jsx
// 自定义Provider组件
function AppProvider({ children }) {
  const [count, setCount] = useState(0);
  
  return (
    <AppContext.Provider value={{ count, setCount }}>
      {children}
    </AppContext.Provider>
  );
}

// 自定义Hook - 使用Provider中的状态
function useAppContext() {
  return useContext(AppContext);
}
```

**状态提升模式**
当多个组件需要共享状态时，将状态提升到它们共同的父组件中，通过props向下传递状态和更新函数。

**受控/非受控组件模式**
受控组件的状态由父组件管理，非受控组件内部维护自己的状态。根据使用场景选择合适的模式来处理表单输入等交互。

```jsx
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('提交的数据:', formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="姓名"
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="邮箱"
        className="w-full p-2 border rounded"
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="留言"
        className="w-full p-2 border rounded h-24"
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        提交
      </button>
    </form>
  );
}
```

**错误边界模式**
使用错误边界组件来捕获和处理子组件树中的JavaScript错误，提供降级UI，防止整个应用崩溃。

**懒加载模式**
使用React.lazy和Suspense来实现组件的按需加载，减少初始bundle大小，改善应用性能。

这些模式各有适用场景，选择合适的模式可以让代码更加优雅和易于维护。现代React开发中，自定义Hooks和组合模式是最常用和推荐的方式。

