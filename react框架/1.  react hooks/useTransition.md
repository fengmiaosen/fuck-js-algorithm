# useTransition Hook 典型使用场景

https://react.dev/reference/react/useTransition

## 概述

`useTransition` 是 React 18 引入的一个 Hook，用于标记状态更新为"过渡"（transition），允许 React 在渲染过程中保持应用的响应性。它主要用于优化用户体验，避免因为大量计算或渲染导致的界面卡顿。

## 基本语法

```javascript
import { useTransition } from 'react';

function MyComponent() {
  const [isPending, startTransition] = useTransition();
  
  // isPending: 布尔值，表示过渡是否正在进行
  // startTransition: 函数，用于包装状态更新
}
```

## 典型使用场景

### 1. 搜索功能优化

当用户在搜索框中输入时，避免搜索结果的渲染阻塞输入框的响应。

```javascript
import { useState, useTransition, useDeferredValue } from 'react';

function SearchApp() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();
  
  const handleSearch = (value) => {
    // 立即更新输入框（紧急更新）
    setQuery(value);
    
    // 延迟更新搜索结果（非紧急更新）
    startTransition(() => {
      const searchResults = performExpensiveSearch(value);
      setResults(searchResults);
    });
  };
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="搜索..."
      />
      
      {isPending && <div>搜索中...</div>}
      
      <SearchResults results={results} />
    </div>
  );
}

function performExpensiveSearch(query) {
  // 模拟复杂的搜索逻辑
  const allData = generateLargeDataSet();
  return allData.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase())
  );
}
```

### 2. 标签页切换

在切换标签页时，保持界面响应性，避免因为新标签页内容渲染导致的卡顿。

```javascript
import { useState, useTransition } from 'react';

function TabContainer() {
  const [activeTab, setActiveTab] = useState('tab1');
  const [isPending, startTransition] = useTransition();
  
  const handleTabChange = (tabId) => {
    startTransition(() => {
      setActiveTab(tabId);
    });
  };
  
  return (
    <div>
      <div className="tab-buttons">
        {['tab1', 'tab2', 'tab3'].map(tabId => (
          <button
            key={tabId}
            onClick={() => handleTabChange(tabId)}
            className={activeTab === tabId ? 'active' : ''}
            disabled={isPending}
          >
            {tabId}
          </button>
        ))}
      </div>
      
      {isPending && <div className="loading">切换中...</div>}
      
      <div className="tab-content">
        <TabContent tabId={activeTab} />
      </div>
    </div>
  );
}

function TabContent({ tabId }) {
  // 模拟复杂的标签页内容
  const content = generateComplexContent(tabId);
  
  return (
    <div>
      {content.map((item, index) => (
        <ComplexComponent key={index} data={item} />
      ))}
    </div>
  );
}
```

### 3. 数据过滤和排序

处理大量数据的过滤和排序操作，保持用户界面的响应性。

```javascript
import { useState, useTransition, useMemo } from 'react';

function DataTable() {
  const [data] = useState(generateLargeDataSet()); // 大量数据
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [isPending, startTransition] = useTransition();
  
  const filteredAndSortedData = useMemo(() => {
    return data
      .filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
  }, [data, filter, sortBy]);
  
  const handleFilterChange = (value) => {
    startTransition(() => {
      setFilter(value);
    });
  };
  
  const handleSortChange = (field) => {
    startTransition(() => {
      setSortBy(field);
    });
  };
  
  return (
    <div>
      <div className="controls">
        <input
          type="text"
          placeholder="过滤数据..."
          onChange={(e) => handleFilterChange(e.target.value)}
        />
        
        <select onChange={(e) => handleSortChange(e.target.value)}>
          <option value="name">按名称排序</option>
          <option value="date">按日期排序</option>
          <option value="category">按类别排序</option>
        </select>
      </div>
      
      {isPending && <div className="loading">处理中...</div>}
      
      <table>
        <thead>
          <tr>
            <th>名称</th>
            <th>日期</th>
            <th>类别</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedData.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.date}</td>
              <td>{item.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 4. 路由导航优化

在单页应用中，优化路由切换的用户体验。

```javascript
import { useState, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';

function Navigation() {
  const [currentRoute, setCurrentRoute] = useState('/home');
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();
  
  const handleNavigation = (route) => {
    startTransition(() => {
      setCurrentRoute(route);
      navigate(route);
    });
  };
  
  return (
    <nav>
      {['/home', '/products', '/about', '/contact'].map(route => (
        <button
          key={route}
          onClick={() => handleNavigation(route)}
          className={currentRoute === route ? 'active' : ''}
          disabled={isPending}
        >
          {route.slice(1)}
        </button>
      ))}
      
      {isPending && <span className="nav-loading">导航中...</span>}
    </nav>
  );
}
```

### 5. 表单验证优化

在复杂表单中，优化实时验证的性能。

```javascript
import { useState, useTransition } from 'react';

function ComplexForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    profile: {}
  });
  const [errors, setErrors] = useState({});
  const [isPending, startTransition] = useTransition();
  
  const validateForm = (data) => {
    // 复杂的验证逻辑
    const newErrors = {};
    
    if (!data.email.includes('@')) {
      newErrors.email = '邮箱格式不正确';
    }
    
    if (data.password.length < 8) {
      newErrors.password = '密码至少8位';
    }
    
    if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = '密码不匹配';
    }
    
    // 更多复杂验证...
    
    return newErrors;
  };
  
  const handleInputChange = (field, value) => {
    // 立即更新输入值
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 延迟验证
    startTransition(() => {
      const newFormData = { ...formData, [field]: value };
      const validationErrors = validateForm(newFormData);
      setErrors(validationErrors);
    });
  };
  
  return (
    <form>
      <div>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="邮箱"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      
      <div>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          placeholder="密码"
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
      
      <div>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          placeholder="确认密码"
        />
        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
      </div>
      
      {isPending && <div className="validation-loading">验证中...</div>}
      
      <button type="submit" disabled={Object.keys(errors).length > 0}>
        提交
      </button>
    </form>
  );
}
```

### 6. 图表数据更新

在数据可视化应用中，优化图表重新渲染的性能。

```javascript
import { useState, useTransition, useEffect } from 'react';

function ChartDashboard() {
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState('1d');
  const [chartType, setChartType] = useState('line');
  const [isPending, startTransition] = useTransition();
  
  const updateChartData = (range, type) => {
    startTransition(() => {
      // 模拟复杂的数据处理
      const newData = processChartData(range, type);
      setChartData(newData);
    });
  };
  
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    updateChartData(range, chartType);
  };
  
  const handleChartTypeChange = (type) => {
    setChartType(type);
    updateChartData(timeRange, type);
  };
  
  return (
    <div className="dashboard">
      <div className="controls">
        <select 
          value={timeRange} 
          onChange={(e) => handleTimeRangeChange(e.target.value)}
        >
          <option value="1h">1小时</option>
          <option value="1d">1天</option>
          <option value="1w">1周</option>
          <option value="1m">1月</option>
        </select>
        
        <select 
          value={chartType} 
          onChange={(e) => handleChartTypeChange(e.target.value)}
        >
          <option value="line">折线图</option>
          <option value="bar">柱状图</option>
          <option value="pie">饼图</option>
        </select>
      </div>
      
      {isPending && (
        <div className="chart-loading">
          <div className="spinner">更新图表中...</div>
        </div>
      )}
      
      <div className={`chart-container ${isPending ? 'updating' : ''}`}>
        <Chart data={chartData} type={chartType} />
      </div>
    </div>
  );
}

function processChartData(timeRange, chartType) {
  // 模拟复杂的数据处理逻辑
  const dataPoints = generateDataPoints(timeRange);
  return transformDataForChart(dataPoints, chartType);
}
```

### 7. 虚拟列表优化

在处理大量列表数据时，优化滚动性能。

```javascript
import { useState, useTransition, useCallback } from 'react';

function VirtualizedList() {
  const [items] = useState(generateLargeItemList(10000));
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });
  const [scrollTop, setScrollTop] = useState(0);
  const [isPending, startTransition] = useTransition();
  
  const handleScroll = useCallback((e) => {
    const newScrollTop = e.target.scrollTop;
    setScrollTop(newScrollTop);
    
    startTransition(() => {
      const itemHeight = 50;
      const containerHeight = e.target.clientHeight;
      const start = Math.floor(newScrollTop / itemHeight);
      const end = Math.min(
        start + Math.ceil(containerHeight / itemHeight) + 5,
        items.length
      );
      
      setVisibleRange({ start, end });
    });
  }, [items.length]);
  
  const visibleItems = items.slice(visibleRange.start, visibleRange.end);
  
  return (
    <div 
      className="virtual-list-container"
      style={{ height: '400px', overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * 50 }}>
        <div 
          style={{ 
            transform: `translateY(${visibleRange.start * 50}px)`,
            opacity: isPending ? 0.7 : 1
          }}
        >
          {visibleItems.map((item, index) => (
            <div 
              key={visibleRange.start + index}
              style={{ height: '50px' }}
              className="list-item"
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>
      
      {isPending && (
        <div className="scroll-indicator">
          更新视图中...
        </div>
      )}
    </div>
  );
}
```

## 最佳实践

### 1. 与 useDeferredValue 结合使用

```javascript
import { useState, useTransition, useDeferredValue } from 'react';

function OptimizedSearch() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);
  
  const handleInputChange = (value) => {
    setQuery(value);
    
    startTransition(() => {
      // 触发搜索相关的状态更新
      performSearch(value);
    });
  };
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="搜索..."
      />
      
      <SearchResults 
        query={deferredQuery} 
        isPending={isPending}
      />
    </div>
  );
}
```

### 2. 错误处理

```javascript
function SafeTransition() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  
  const handleDataUpdate = async (newParams) => {
    setError(null);
    
    startTransition(async () => {
      try {
        const result = await fetchData(newParams);
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    });
  };
  
  return (
    <div>
      {error && <div className="error">错误: {error}</div>}
      {isPending && <div className="loading">加载中...</div>}
      <DataDisplay data={data} />
    </div>
  );
}
```

### 3. 性能监控

```javascript
import { useState, useTransition, useEffect } from 'react';

function PerformanceMonitoredComponent() {
  const [isPending, startTransition] = useTransition();
  const [performanceMetrics, setPerformanceMetrics] = useState({});
  
  useEffect(() => {
    if (isPending) {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        setPerformanceMetrics(prev => ({
          ...prev,
          lastTransitionDuration: duration
        }));
        
        // 发送性能数据到监控服务
        if (duration > 100) {
          console.warn(`Slow transition detected: ${duration}ms`);
        }
      };
    }
  }, [isPending]);
  
  return (
    <div>
      {/* 组件内容 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="performance-info">
          上次过渡耗时: {performanceMetrics.lastTransitionDuration?.toFixed(2)}ms
        </div>
      )}
    </div>
  );
}
```

## 注意事项

1. **不要过度使用**: 只在确实需要优化用户体验的场景下使用
2. **紧急更新优先**: 用户输入等紧急更新不应该包装在 startTransition 中
3. **合理的加载状态**: 利用 isPending 提供合适的用户反馈
4. **性能监控**: 监控过渡的执行时间，避免过长的阻塞
5. **渐进增强**: 确保在不支持 useTransition 的环境中应用仍能正常工作

## 总结

`useTransition` 是 React 18 中一个强大的性能优化工具，主要用于：

- 保持用户界面的响应性
- 优化大量数据处理的用户体验
- 提供更流畅的交互反馈
- 避免因复杂渲染导致的界面卡顿

通过合理使用 `useTransition`，可以显著提升应用的用户体验，特别是在处理复杂数据操作和频繁状态更新的场景中。