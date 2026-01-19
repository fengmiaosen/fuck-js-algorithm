# React 中如何实现类似 Vue 的 keep-alive 功能

## 核心思路

- 保持组件实例常驻，通过 `createPortal` 在“可见容器”和“隐藏容器”之间搬运同一子树。
- 使用常驻的 `KeepAliveProvider` 管理缓存，依靠 `cacheKey` 标识要缓存的子树。
- 当路由/条件渲染导致壳组件卸载时，仅切换子树的挂载目标到隐藏容器，实例与状态继续存在。
- 再次进入时，把同一实例的挂载目标切回可见容器，实现“复活”。

## 最小实现

```tsx
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const KeepAliveContext = createContext(null)

export function KeepAliveProvider({ children }: { children: React.ReactNode }) {
  const hiddenRootRef = useRef<HTMLElement | null>(null)
  const [caches, setCaches] = useState<Map<string, { element: React.ReactElement | null, host: HTMLElement | null, key: string }>>(new Map())

  useEffect(() => {
    const el = document.createElement('div')
    el.style.position = 'fixed'
    el.style.width = '0px'
    el.style.height = '0px'
    el.style.overflow = 'hidden'
    el.style.pointerEvents = 'none'
    document.body.appendChild(el)
    hiddenRootRef.current = el
    return () => {
      document.body.removeChild(el)
    }
  }, [])

  const api = useMemo(() => ({
    activate(key: string, element: React.ReactElement, host?: HTMLElement | null) {
      setCaches(prev => {
        const next = new Map(prev)
        const existing = next.get(key)
        next.set(key, { element, host: host ?? (existing ? existing.host : null), key })
        return next
      })
    },
    setHost(key: string, host: HTMLElement | null) {
      setCaches(prev => {
        const next = new Map(prev)
        const existing = next.get(key)
        if (existing) next.set(key, { ...existing, host })
        else next.set(key, { element: null, host, key })
        return next
      })
    },
    deactivate(key: string) {
      setCaches(prev => {
        const next = new Map(prev)
        const existing = next.get(key)
        if (existing) next.set(key, { ...existing, host: null })
        return next
      })
    },
    drop(key: string) {
      setCaches(prev => {
        const next = new Map(prev)
        next.delete(key)
        return next
      })
    }
  }), [])

  const portals: React.ReactNode[] = []
  if (hiddenRootRef.current) {
    caches.forEach(({ element, host, key }) => {
      if (element) portals.push(createPortal(element, host || hiddenRootRef.current, key))
    })
  }

  return (
    <KeepAliveContext.Provider value={api}>
      {children}
      {portals}
    </KeepAliveContext.Provider>
  )
}

export function KeepAlive({ cacheKey, children }: { cacheKey: string, children: React.ReactElement }) {
  const api = useContext(KeepAliveContext) as any
  const hostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!api) return
    api.setHost(cacheKey, hostRef.current)
    return () => {
      api.deactivate(cacheKey)
    }
  }, [cacheKey, api])

  useEffect(() => {
    if (!api) return
    api.activate(cacheKey, children, hostRef.current)
  }, [children, cacheKey, api])

  return <div ref={hostRef} />
}
```

## 用法示例

```tsx
import React from 'react'
import { KeepAliveProvider, KeepAlive } from './KeepAlive'

function Counter() {
  const [n, setN] = React.useState(0)
  return (
    <div>
      <div>{n}</div>
      <button onClick={() => setN(v => v + 1)}>+</button>
    </div>
  )
}

export default function Demo() {
  const [tab, setTab] = React.useState<'a' | 'b'>('a')
  return (
    <KeepAliveProvider>
      <div>
        <button onClick={() => setTab('a')}>A</button>
        <button onClick={() => setTab('b')}>B</button>
      </div>
      {tab === 'a' && <KeepAlive cacheKey="A"><Counter /></KeepAlive>}
      {tab === 'b' && <KeepAlive cacheKey="B"><Counter /></KeepAlive>}
    </KeepAliveProvider>
  )
}
```

- 切换到 B 时，A 的 `Counter` 状态保留在隐藏容器；切回 A 时原实例复用。

## 路由集成

- 在路由外层包一个 `KeepAliveProvider`，对每个路径用 `cacheKey` 标识。

```tsx
import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { KeepAlive } from './KeepAlive'

export function AliveOutlet() {
  const location = useLocation()
  return <KeepAlive cacheKey={location.pathname}><Outlet /></KeepAlive>
}
```

- 在路由树中把需要缓存的分支用 `AliveOutlet` 包裹，即可在路径切换时保留组件实例与状态。

## 能力扩展

- 控制缓存大小：在 `KeepAliveProvider` 增加 `max`，超出时做 LRU（Least Recently Used）淘汰。
- 包含/排除：根据路由或组件名决定是否调用 `activate` 或在卸载时 `drop`。
- 主动清理：通过 `useContext(KeepAliveContext)` 调用 `drop('key')` 清除某个缓存。
- 条件缓存：给 `KeepAlive` 增加 `when` 布尔，`false` 时不缓存并在卸载时 `drop`。

## 与 Vue 差异

- Vue 有 `activated/deactivated` 钩子；React 中子树仍然处于“挂载”状态，`useEffect` 不会自动暂停。
- 对于轮询、订阅、动画等，建议在组件内根据“是否处于可见容器”自行控制开关，例如使用 `document.contains(ref.current)` 判断，或把“活跃状态”通过上下文传给子树并据此暂停副作用。
- React 还存在实验性的 `unstable_Offscreen`，能更优雅地处理“隐藏但保留状态”，但不稳定且不建议生产使用。

## 现成库

- 若不想自研，可使用社区库如 `react-activation`，其行为与 Vue `keep-alive` 接近，并提供路由适配。选择前需确认与 React/路由版本兼容性。

## 总结

- 核心是保持子树常驻并用 `createPortal` 在可见与隐藏容器间切换。
- 文中的 `KeepAliveProvider` + `KeepAlive` 为通用最小实现，适合在标签页、路由页面等场景保留状态与实例。
- 可按需补充缓存大小控制、包含/排除和主动清理等能力。