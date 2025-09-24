### useDeferredValue 典型使用场景

**它解决什么问题**
- **输入流畅性优先**：当输入（如搜索框）与昂贵计算/渲染（如大列表过滤、图表重绘、Markdown 预览）耦合时，让输入先响应，昂贵部分稍后再更新。
- **降低优先级**：不是跳过工作，而是把依赖的值“降权”，以更低优先级执行，从而避免卡顿或视觉撕裂。

---

**1) 搜索输入 + 大列表过滤**（最常见）
- **场景**：输入时实时过滤上万条数据或复杂排序，导致每敲一个字都卡顿。
- **做法**：用 `useDeferredValue` 包住搜索词，只让昂贵过滤依赖“延迟后的值”。

```tsx
import { useMemo, useDeferredValue, useState } from 'react';

function BigListSearch({ items }: { items: string[] }) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query); // 降低昂贵过滤的优先级

  const filtered = useMemo(() => {
    // 假设这里很昂贵
    const lower = deferredQuery.toLowerCase();
    return items.filter(i => i.toLowerCase().includes(lower));
  }, [items, deferredQuery]);

  const isStale = query !== deferredQuery; // 可用于显示轻量状态

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索..." />
      {isStale && <span style={{ marginLeft: 8 }}>加载中…</span>}
      <ul>
        {filtered.map((it, idx) => (
          <li key={idx}>{it}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

**2) Markdown 编辑器：输入 + 预览渲染**
- **场景**：Markdown 解析和预览渲染昂贵，边打字边解析会卡。
- **做法**：输入使用即时值，预览依赖 `deferredValue`，保持输入流畅。

```tsx
import { useDeferredValue, useMemo, useState } from 'react';
// 假设 expensiveMarkdownToHtml 很昂贵

function MarkdownEditor() {
  const [text, setText] = useState('');
  const deferred = useDeferredValue(text);

  const html = useMemo(() => expensiveMarkdownToHtml(deferred), [deferred]);

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <textarea value={text} onChange={e => setText(e.target.value)} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
```

---

**3) 复杂数据透视/图表重绘**
- **场景**：筛选条件频繁变化，触发数据透视、聚合、ECharts/Chart.js 重绘。
- **做法**：把筛选条件用 `useDeferredValue` 包住，图表依赖“延迟后的条件”。

```tsx
const deferredFilters = useDeferredValue(filters);
const chartData = useMemo(() => buildChartData(rawData, deferredFilters), [rawData, deferredFilters]);
```

---

**4) Tab/详情切换时的次要面板**
- **场景**：主面板要立即切换，次要面板（如侧栏分析、推荐列表）可慢一点。
- **做法**：次要面板依赖 `deferredValue`，主面板用即时值，减少切换卡顿。

---

**5) 避免“撕裂感”的 UI 协调**
- **场景**：父组件状态快速变化导致子组件昂贵渲染跟不上的视觉跳动。
- **做法**：让昂贵子树依赖 `deferredValue`，与输入解耦，减少同步抖动。

---

**与 useTransition 的区别与选择**
- **useDeferredValue**：对“值”降级。最小改动，替换依赖值即可。适合“昂贵计算/渲染依赖某个值”的场景。
- **useTransition**：对“状态更新”降级。包裹触发更新的那次 `setState`。适合路由切换、列表切页等整段 UI 更新降级。
- 常见经验：若只是因为某个依赖值导致昂贵渲染，用 `useDeferredValue` 更简单；需要把整次更新作为“非紧急”处理，则用 `useTransition`。

---

**最佳实践与注意事项**
- **只延迟昂贵依赖**：输入框、轻量交互用原值；昂贵计算/渲染用 `deferredValue`。
- **配合 `useMemo`/`memo`**：确保昂贵计算和大子树真的能被缓存/剪枝。
- **状态提示**：`isStale = raw !== deferred` 可用来显示“加载中/计算中”。
- **不是节流/防抖**：不会减少工作量，只是安排顺序，必要时可与节流/防抖组合。
- **避免误用**：如果计算不昂贵或节点很小，收益不大；优先优化算法和拆分组件。

---

**一句话记忆**
- 当“某个值的改变会触发很贵的渲染”，而你又想先保证输入/交互流畅，就让昂贵部分依赖 `useDeferredValue` 后的值。
