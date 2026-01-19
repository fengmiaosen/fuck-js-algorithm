
### 高阶组件 HOC

实现高阶组件的方式有以下两种:

* 属性代理(Props Proxy)

返回一个无状态（stateless）的函数组件
返回一个 class 组件



* 反向继承(Inheritance Inversion)


### render props



### react hooks


### 参考资料

* [组件演进史：从Mixin到HOC，再到Hook](https://mp.weixin.qq.com/s/7oUNOuZ2QW8C4h99G8uquw)
* [React高阶组件(HOC)的入门📖及实践💻](https://juejin.cn/post/6844904050236850184)
* [渲染属性 render-props](https://tsejx.github.io/react-guidebook/foundation/advanced-guides/render-props)
* [使用 Render props 吧](https://juejin.cn/post/6844903521343504398)

# 高阶组件（HOC）与 Render Props 总结

## 核心概念

- 高阶组件（HOC）：接受一个组件并返回增强后的新组件，用于复用跨切面逻辑
- Render Props：将可复用的状态与行为通过函数作为 `children` 或 `render` 传入，由使用方决定视图
- 二者目标一致：提升逻辑复用与组合能力；差异在于组合方式（包装 vs. 函数回调）
- 在 Hooks 出现后，业务自写逻辑优先自定义 Hook；HOC/Render Props适用于增强现有组件或需要灵活视图的场景

## 高阶组件（HOC）

- Props 代理：拦截、扩展或改写传入的 props
- 条件渲染：根据状态展示占位、错误或真正内容
- 状态注入：封装副作用与状态管理，向下游组件注入
- Ref 与静态属性：转发 `ref`，保留 `displayName` 和静态属性

```tsx
function withLoading<T extends object>(Wrapped: React.ComponentType<T>) {
  return function Component(props: T & { loading: boolean }) {
    if (props.loading) return <div>Loading...</div>;
    const { loading, ...rest } = props as any;
    return <Wrapped {...(rest as T)} />;
  };
}
```

```tsx
function withFetch(url: string) {
  return function <T extends object>(
    Wrapped: React.ComponentType<
      T & { data: any; loading: boolean; error: any }
    >
  ) {
    return function Component(props: T) {
      const [data, setData] = React.useState<any>(null);
      const [loading, setLoading] = React.useState(false);
      const [error, setError] = React.useState<any>(null);

      React.useEffect(() => {
        let cancelled = false;
        setLoading(true);
        fetch(url)
          .then(r => r.json())
          .then(d => { if (!cancelled) setData(d); })
          .catch(e => { if (!cancelled) setError(e); })
          .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
      }, [url]);

      return <Wrapped {...props} data={data} loading={loading} error={error} />;
    };
  };
}
```

```tsx
function withForwardRef<P extends object>(Wrapped: React.ComponentType<P>) {
  const Component = React.forwardRef<any, P>((props, ref) => {
    return <Wrapped {...props} ref={ref as any} />;
  });
  Component.displayName = `withForwardRef(${(Wrapped as any).displayName || Wrapped.name || 'Component'})`;
  return Component as React.ComponentType<P>;
}
```

## Render Props

- children 作为函数：容器组件提供状态与行为，使用方定义渲染
- render 属性：与 children 函数同义的另一种接口形式
- 适合需要完全自定义视图的场景，如指针跟踪、数据获取、手势、可视化等

```tsx
function Mouse(props: { children: (pos: { x: number; y: number }) => React.ReactNode }) {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  React.useEffect(() => {
    function handler(e: MouseEvent) { setPos({ x: e.clientX, y: e.clientY }); }
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return props.children(pos);
}
```

```tsx
function DataProvider(props: {
  query: string;
  children: (s: { data: any; loading: boolean; error: any }) => React.ReactNode;
}) {
  const [state, setState] = React.useState({ data: null as any, loading: false, error: null as any });
  React.useEffect(() => {
    let cancelled = false;
    setState(s => ({ ...s, loading: true, error: null }));
    fetch(props.query)
      .then(r => r.json())
      .then(d => { if (!cancelled) setState({ data: d, loading: false, error: null }); })
      .catch(e => { if (!cancelled) setState({ data: null, loading: false, error: e }); });
    return () => { cancelled = true; };
  }, [props.query]);
  return props.children(state);
}
```

```tsx
function Toggle(props: { children: (on: boolean, toggle: () => void) => React.ReactNode }) {
  const [on, setOn] = React.useState(false);
  const toggle = React.useCallback(() => setOn(v => !v), []);
  return props.children(on, toggle);
}
```

## TypeScript 范式

- HOC 泛型与冲突规避：用 `Omit` 排除由 HOC 注入的属性
- 函数子元素类型：将 `children` 声明为特定签名的函数，返回 `ReactNode`

```tsx
type WithLoadingProps = { loading: boolean };
function withLoading<P extends object>(Wrapped: React.ComponentType<P>) {
  type Props = Omit<P, keyof WithLoadingProps> & WithLoadingProps;
  const Component: React.FC<Props> = (props) => {
    if (props.loading) return <div>Loading</div>;
    const { loading, ...rest } = props as any;
    return <Wrapped {...(rest as P)} />;
  };
  Component.displayName = `withLoading(${(Wrapped as any).displayName || Wrapped.name || 'Component'})`;
  return Component;
}
```

```tsx
type MouseChildren = (pos: { x: number; y: number }) => React.ReactNode;
function Mouse({ children }: { children: MouseChildren }) {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  React.useEffect(() => {
    function handler(e: MouseEvent) { setPos({ x: e.clientX, y: e.clientY }); }
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return children(pos);
}
```

## 选型建议

- 纯逻辑复用优先自定义 Hook；需要对外暴露组件接口或增强现有组件时考虑 HOC
- 视图需由使用方完全决定时用 Render Props；无侵入增强现有组件时用 HOC
- 避免“包装地狱”，复杂逻辑下沉为 Hook，再由轻量组件消费

## 常见陷阱与规避

- Props 名冲突：为注入属性采用命名约定或在 TS 中用 `Omit`
- `ref` 丢失：通过 `forwardRef` 转发
- 静态属性丢失：包装后手动拷贝静态属性或使用静态提升工具
- 函数子元素重建导致重渲染：为传入函数使用 `useCallback` 保持稳定引用
- 过度抽象：保持单一职责，每个 HOC/容器组件专注一个横切关注点

## 完整示例

### HOC：从定义到使用（加载态）

```tsx
type ButtonProps = { text: string; onClick: () => void };
function Button({ text, onClick }: ButtonProps) {
  return <button onClick={onClick}>{text}</button>;
}

function withLoading<T extends object>(Wrapped: React.ComponentType<T>) {
  return function Component(props: T & { loading: boolean }) {
    if (props.loading) return <div>Loading...</div>;
    const { loading, ...rest } = props as any;
    return <Wrapped {...(rest as T)} />;
  };
}

const LoadingButton = withLoading<ButtonProps>(Button);

function App1() {
  const [loading, setLoading] = React.useState(false);
  const toggle = () => setLoading(v => !v);
  return (
    <div>
      <LoadingButton text="提交" onClick={toggle} loading={loading} />
      <button onClick={toggle}>{loading ? '取消加载' : '开启加载'}</button>
    </div>
  );
}
```

### HOC：从定义到使用（数据获取）

```tsx
type User = { id: number; name: string };
type UserListProps = { data: User[] | null; loading: boolean; error: any };

function UserList({ data, loading, error }: UserListProps) {
  if (loading) return <div>加载中</div>;
  if (error) return <div>出错</div>;
  if (!data || data.length === 0) return <div>无数据</div>;
  return (
    <ul>
      {data.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}

function withFetch(url: string) {
  return function <T extends object>(
    Wrapped: React.ComponentType<
      T & { data: any; loading: boolean; error: any }
    >
  ) {
    return function Component(props: T) {
      const [data, setData] = React.useState<any>(null);
      const [loading, setLoading] = React.useState(false);
      const [error, setError] = React.useState<any>(null);

      React.useEffect(() => {
        let cancelled = false;
        setLoading(true);
        fetch(url)
          .then(r => r.json())
          .then(d => { if (!cancelled) setData(d); })
          .catch(e => { if (!cancelled) setError(e); })
          .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
      }, [url]);

      return <Wrapped {...props} data={data} loading={loading} error={error} />;
    };
  };
}

const UsersWithFetch = withFetch('/api/users')(UserList);

function App2() {
  return <UsersWithFetch />;
}
```

### Render Props：从定义到使用（鼠标位置）

```tsx
function Mouse(props: { children: (pos: { x: number; y: number }) => React.ReactNode }) {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  React.useEffect(() => {
    function handler(e: MouseEvent) { setPos({ x: e.clientX, y: e.clientY }); }
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return props.children(pos);
}

function MouseDemo() {
  return (
    <div>
      <Mouse>
        {pos => (
          <>
            <div style={{ position: 'fixed', left: pos.x - 5, top: pos.y - 5, width: 10, height: 10, background: '#7c3aed', borderRadius: '50%' }} />
            <div>x: {pos.x}, y: {pos.y}</div>
          </>
        )}
      </Mouse>
    </div>
  );
}
```

### Render Props：从定义到使用（数据提供）

```tsx
function DataProvider(props: {
  query: string;
  children: (s: { data: any; loading: boolean; error: any }) => React.ReactNode;
}) {
  const [state, setState] = React.useState({ data: null as any, loading: false, error: null as any });
  React.useEffect(() => {
    let cancelled = false;
    setState(s => ({ ...s, loading: true, error: null }));
    fetch(props.query)
      .then(r => r.json())
      .then(d => { if (!cancelled) setState({ data: d, loading: false, error: null }); })
      .catch(e => { if (!cancelled) setState({ data: null, loading: false, error: e }); });
    return () => { cancelled = true; };
  }, [props.query]);
  return props.children(state);
}

function UsersView() {
  return (
    <DataProvider query="/api/users">
      {({ data, loading, error }) => {
        if (loading) return <div>加载中</div>;
        if (error) return <div>出错</div>;
        if (!data || data.length === 0) return <div>无数据</div>;
        return <ul>{data.map((u: any) => <li key={u.id}>{u.name}</li>)}</ul>;
      }}
    </DataProvider>
  );
}
```