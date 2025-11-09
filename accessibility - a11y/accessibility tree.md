# Accessibility Tree（无障碍树）核心概念和基本示例

## 1. 核心概念和定义

### 什么是 Accessibility Tree？

**Accessibility Tree（无障碍树）** 是浏览器基于 DOM 树构建的一个简化的树状结构，专门为辅助技术（如屏幕阅读器、语音识别软件等）提供页面内容的语义化信息。

### 核心特点

- **语义化表示**：只包含对辅助技术有意义的元素
- **简化结构**：过滤掉纯装饰性元素（如 `<div>`、`<span>` 等）
- **角色明确**：每个节点都有明确的角色（role）、名称（name）和状态（state）
- **动态更新**：随着 DOM 变化而实时更新

## 2. Accessibility Tree 与 DOM Tree 的关系

### DOM Tree（文档对象模型树）
```
<html>
├── <head>
│   └── <title>页面标题</title>
├── <body>
│   ├── <div class="container">
│   │   ├── <h1>主标题</h1>
│   │   ├── <p>段落内容</p>
│   │   └── <button>点击按钮</button>
│   └── <footer>
│       └── <span>版权信息</span>
```

### 对应的 Accessibility Tree
```
WebArea "页面标题"
├── heading "主标题" (level 1)
├── text "段落内容"
├── button "点击按钮"
└── text "版权信息"
```

### 关键差异

| DOM Tree | Accessibility Tree |
|----------|-------------------|
| 包含所有HTML元素 | 只包含语义化元素 |
| 保留完整结构 | 简化为扁平结构 |
| 关注视觉呈现 | 关注语义含义 |
| 包含装饰性元素 | 过滤装饰性元素 |

## 3. 基本HTML示例

### 示例1：基础表单结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>用户注册表单</title>
</head>
<body>
    <main>
        <h1>用户注册</h1>
        <form>
            <div class="form-group">
                <label for="username">用户名：</label>
                <input type="text" id="username" name="username" required>
            </div>
            
            <div class="form-group">
                <label for="email">邮箱：</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="password">密码：</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit">注册</button>
        </form>
    </main>
</body>
</html>
```

### 对应的 Accessibility Tree 结构：

```
WebArea "用户注册表单"
├── main
│   ├── heading "用户注册" (level 1)
│   └── form
│       ├── LabelText "用户名："
│       ├── textbox "用户名：" (required)
│       ├── LabelText "邮箱："
│       ├── textbox "邮箱：" (required, type=email)
│       ├── LabelText "密码："
│       ├── textbox "密码：" (required, type=password)
│       └── button "注册" (type=submit)
```

## 4. 使用 ARIA 属性优化 Accessibility Tree

### 示例2：复杂的导航菜单

```html
<nav aria-label="主导航">
    <ul role="menubar">
        <li role="none">
            <a href="#" role="menuitem" aria-haspopup="true" aria-expanded="false">
                产品
            </a>
            <ul role="menu" aria-label="产品子菜单">
                <li role="none">
                    <a href="/web-app" role="menuitem">Web应用</a>
                </li>
                <li role="none">
                    <a href="/mobile-app" role="menuitem">移动应用</a>
                </li>
            </ul>
        </li>
        <li role="none">
            <a href="/about" role="menuitem">关于我们</a>
        </li>
    </ul>
</nav>
```

### 优化后的 Accessibility Tree：

```
navigation "主导航"
└── menubar
    ├── menuitem "产品" (haspopup=true, expanded=false)
    │   └── menu "产品子菜单"
    │       ├── menuitem "Web应用"
    │       └── menuitem "移动应用"
    └── menuitem "关于我们"
```

### 示例3：动态内容区域

```html
<div class="status-container">
    <div 
        id="status-message" 
        role="status" 
        aria-live="polite"
        aria-atomic="true">
        <!-- 动态状态消息 -->
    </div>
    
    <div 
        id="error-message" 
        role="alert" 
        aria-live="assertive"
        aria-atomic="true"
        style="display: none;">
        <!-- 错误消息 -->
    </div>
</div>

<script>
// 更新状态消息
function updateStatus(message) {
    document.getElementById('status-message').textContent = message;
}

// 显示错误消息
function showError(error) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = error;
    errorDiv.style.display = 'block';
}
</script>
```

## 5. 实际代码示例和最佳实践

### 示例4：可访问的数据表格

```html
<table role="table" aria-label="员工信息表">
    <caption>公司员工基本信息统计</caption>
    <thead>
        <tr role="row">
            <th role="columnheader" scope="col" aria-sort="none">
                <button aria-label="按姓名排序">姓名</button>
            </th>
            <th role="columnheader" scope="col" aria-sort="none">
                <button aria-label="按部门排序">部门</button>
            </th>
            <th role="columnheader" scope="col" aria-sort="none">
                <button aria-label="按职位排序">职位</button>
            </th>
        </tr>
    </thead>
    <tbody>
        <tr role="row">
            <td role="gridcell">张三</td>
            <td role="gridcell">技术部</td>
            <td role="gridcell">前端工程师</td>
        </tr>
        <tr role="row">
            <td role="gridcell">李四</td>
            <td role="gridcell">产品部</td>
            <td role="gridcell">产品经理</td>
        </tr>
    </tbody>
</table>
```

### 示例5：模态对话框

```html
<div 
    id="modal" 
    role="dialog" 
    aria-labelledby="modal-title"
    aria-describedby="modal-description"
    aria-modal="true"
    style="display: none;">
    
    <div class="modal-content">
        <h2 id="modal-title">确认删除</h2>
        <p id="modal-description">
            您确定要删除这个项目吗？此操作不可撤销。
        </p>
        
        <div class="modal-actions">
            <button id="confirm-btn" aria-describedby="modal-description">
                确认删除
            </button>
            <button id="cancel-btn" aria-label="取消删除操作">
                取消
            </button>
        </div>
    </div>
</div>

<script>
function openModal() {
    const modal = document.getElementById('modal');
    const confirmBtn = document.getElementById('confirm-btn');
    
    modal.style.display = 'block';
    
    // 设置焦点到第一个可交互元素
    confirmBtn.focus();
    
    // 捕获焦点在模态框内
    modal.addEventListener('keydown', trapFocus);
}

function trapFocus(e) {
    if (e.key === 'Tab') {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    }
}
</script>
```

## 6. 调试和测试 Accessibility Tree

### 浏览器开发者工具

1. **Chrome DevTools**
   ```
   Elements 面板 → Accessibility 选项卡
   ```

2. **Firefox DevTools**
   ```
   Inspector → Accessibility 面板
   ```

3. **Safari Web Inspector**
   ```
   Elements → Node → Accessibility
   ```

### 编程方式访问

```javascript
// 获取元素的可访问性信息
function getAccessibilityInfo(element) {
    const computedRole = element.getAttribute('role') || element.tagName.toLowerCase();
    const computedName = element.getAttribute('aria-label') || 
                        element.getAttribute('aria-labelledby') || 
                        element.textContent;
    
    return {
        role: computedRole,
        name: computedName,
        description: element.getAttribute('aria-describedby'),
        state: {
            expanded: element.getAttribute('aria-expanded'),
            checked: element.getAttribute('aria-checked'),
            disabled: element.hasAttribute('disabled'),
            hidden: element.getAttribute('aria-hidden') === 'true'
        }
    };
}

// 使用示例
const button = document.querySelector('button');
console.log(getAccessibilityInfo(button));
```

## 7. 常见的 Accessibility Tree 节点类型

| 节点类型 | 描述 | HTML示例 |
|---------|------|----------|
| WebArea | 页面根节点 | `<html>` |
| heading | 标题节点 | `<h1>` - `<h6>` |
| button | 按钮节点 | `<button>`, `<input type="button">` |
| textbox | 文本输入框 | `<input type="text">`, `<textarea>` |
| link | 链接节点 | `<a href="...">` |
| list | 列表容器 | `<ul>`, `<ol>` |
| listitem | 列表项 | `<li>` |
| table | 表格容器 | `<table>` |
| row | 表格行 | `<tr>` |
| cell | 表格单元格 | `<td>`, `<th>` |
| navigation | 导航区域 | `<nav>` |
| main | 主要内容 | `<main>` |
| banner | 页面横幅 | `<header>` |
| contentinfo | 内容信息 | `<footer>` |

## 8. 最佳实践总结

### ✅ 推荐做法

1. **使用语义化HTML元素**
   ```html
   <button>提交</button>  <!-- 而不是 <div onclick="...">提交</div> -->
   ```

2. **提供有意义的标签**
   ```html
   <label for="search">搜索内容</label>
   <input type="text" id="search" placeholder="请输入关键词">
   ```

3. **使用ARIA属性增强语义**
   ```html
   <div role="button" tabindex="0" aria-label="关闭对话框">×</div>
   ```

4. **管理焦点状态**
   ```html
   <button aria-expanded="false" aria-controls="menu">菜单</button>
   ```

### ❌ 避免的做法

1. **过度使用ARIA**
   ```html
   <!-- 不必要的ARIA -->
   <button role="button" aria-label="按钮">按钮</button>
   ```

2. **隐藏重要内容**
   ```html
   <!-- 错误：隐藏了重要的标签 -->
   <label style="display: none;">用户名</label>
   ```

3. **不一致的状态管理**
   ```html
   <!-- 错误：视觉状态与ARIA状态不一致 -->
   <button aria-expanded="true" class="collapsed">展开</button>
   ```

通过理解和正确实现 Accessibility Tree，我们可以创建对所有用户都友好的Web应用程序，确保辅助技术能够正确理解和传达页面内容。