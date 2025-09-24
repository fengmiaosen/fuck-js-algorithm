# 前端开发面试 - Accessibility (a11y) 知识点

## 概述

Web Accessibility (a11y) 是指让网站和应用程序对所有用户都可访问，包括有视觉、听觉、运动或认知障碍的用户。在前端开发面试中，a11y 知识点越来越重要，体现了开发者对用户体验和社会责任的重视。

## 核心概念

### 什么是 Web Accessibility？

Web 可访问性是指设计和开发网站、工具和技术，使残障人士能够使用它们。更具体地说，人们可以：
- 感知、理解、导航和与网络交互
- 为网络做出贡献

### WCAG (Web Content Accessibility Guidelines)

WCAG 是 Web 内容可访问性指南，提供了使 Web 内容更易访问的建议。

**WCAG 2.1 四大原则 (POUR)**：
1. **Perceivable (可感知)**: 信息和用户界面组件必须以用户能够感知的方式呈现
2. **Operable (可操作)**: 用户界面组件和导航必须是可操作的
3. **Understandable (可理解)**: 信息和用户界面的操作必须是可理解的
4. **Robust (健壮)**: 内容必须足够健壮，能够被各种用户代理（包括辅助技术）可靠地解释

## 面试常考知识点

### 1. 语义化 HTML (Semantic HTML)

**面试问题**: "为什么语义化 HTML 对可访问性很重要？"

**关键点**:
- 使用正确的 HTML 元素来表达内容的含义
- 屏幕阅读器依赖语义化标签来理解页面结构
- 提供更好的 SEO 和可维护性

**示例**:
```html
<!-- ❌ 不好的做法 -->
<div class="button" onclick="submitForm()">提交</div>
<div class="heading">页面标题</div>

<!-- ✅ 好的做法 -->
<button type="submit" onclick="submitForm()">提交</button>
<h1>页面标题</h1>

<!-- ✅ 语义化结构 -->
<header>
  <nav>
    <ul>
      <li><a href="#home">首页</a></li>
      <li><a href="#about">关于</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>文章标题</h1>
    <section>
      <h2>章节标题</h2>
      <p>内容...</p>
    </section>
  </article>
</main>

<footer>
  <p>&copy; 2024 公司名称</p>
</footer>
```

### 2. ARIA (Accessible Rich Internet Applications)

**面试问题**: "什么是 ARIA？什么时候使用 ARIA 属性？"

**关键 ARIA 属性**:

#### aria-label
为元素提供可访问的名称
```html
<button aria-label="关闭对话框">×</button>
<input type="search" aria-label="搜索产品">
```

#### aria-labelledby
引用其他元素来标记当前元素
```html
<h2 id="settings-title">账户设置</h2>
<div role="group" aria-labelledby="settings-title">
  <!-- 设置选项 -->
</div>
```

#### aria-describedby
引用描述当前元素的其他元素
```html
<input type="password" aria-describedby="pwd-help">
<div id="pwd-help">密码必须至少包含8个字符</div>
```

#### aria-expanded
指示可折叠元素的状态
```html
<button aria-expanded="false" aria-controls="menu">菜单</button>
<ul id="menu" hidden>
  <li><a href="#item1">项目1</a></li>
  <li><a href="#item2">项目2</a></li>
</ul>
```

#### aria-hidden
从辅助技术中隐藏装饰性元素
```html
<button>
  <span aria-hidden="true">👍</span>
  点赞
</button>
```

#### role 属性
定义元素的用途
```html
<div role="button" tabindex="0">自定义按钮</div>
<div role="alert">错误消息</div>
<div role="navigation">导航区域</div>
```

### 3. 键盘导航 (Keyboard Navigation)

**面试问题**: "如何确保网站支持键盘导航？"

**关键点**:
- 所有交互元素都应该可以通过键盘访问
- 合理的 Tab 顺序
- 可见的焦点指示器
- 支持常用键盘快捷键

**示例**:
```html
<!-- 确保 tabindex 合理 -->
<div class="modal" tabindex="-1">
  <button class="close-btn" tabindex="0">关闭</button>
  <input type="text" tabindex="0">
  <button type="submit" tabindex="0">提交</button>
</div>

<!-- 自定义交互元素需要键盘支持 -->
<div 
  role="button" 
  tabindex="0"
  onkeydown="handleKeyDown(event)"
  onclick="handleClick()"
>
  自定义按钮
</div>
```

```javascript
function handleKeyDown(event) {
  // 支持 Enter 和 Space 键
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleClick();
  }
}

// 焦点管理
function openModal() {
  const modal = document.getElementById('modal');
  const firstFocusable = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  
  modal.style.display = 'block';
  firstFocusable.focus();
}
```

**CSS 焦点样式**:
```css
/* 确保焦点可见 */
button:focus,
input:focus,
select:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* 自定义焦点样式 */
.custom-button:focus {
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.3);
}
```

### 4. 颜色和对比度 (Color and Contrast)

**面试问题**: "如何确保网站的颜色对比度符合可访问性标准？"

**WCAG 对比度要求**:
- **AA 级别**: 正常文本 4.5:1，大文本 3:1
- **AAA 级别**: 正常文本 7:1，大文本 4.5:1

**示例**:
```css
/* ❌ 对比度不足 */
.low-contrast {
  color: #999999;
  background-color: #ffffff;
  /* 对比度约 2.85:1，不符合 AA 标准 */
}

/* ✅ 符合 AA 标准 */
.good-contrast {
  color: #333333;
  background-color: #ffffff;
  /* 对比度约 12.6:1，符合 AAA 标准 */
}

/* 不要仅依赖颜色传达信息 */
.error-message {
  color: #d32f2f;
  border-left: 4px solid #d32f2f; /* 额外的视觉提示 */
}

.error-message::before {
  content: "⚠️ "; /* 图标提示 */
}
```

### 5. 图片和媒体可访问性

**面试问题**: "如何让图片和媒体内容对屏幕阅读器用户可访问？"

**图片 alt 文本**:
```html
<!-- 信息性图片 -->
<img src="chart.png" alt="2024年销售数据显示第二季度增长了25%">

<!-- 装饰性图片 -->
<img src="decoration.png" alt="" role="presentation">

<!-- 复杂图片 -->
<img src="complex-chart.png" alt="销售趋势图" aria-describedby="chart-description">
<div id="chart-description">
  详细描述：该图表显示了2024年各季度的销售数据...
</div>

<!-- 图片按钮 -->
<button>
  <img src="search-icon.png" alt="搜索">
</button>
```

**视频可访问性**:
```html
<video controls>
  <source src="video.mp4" type="video/mp4">
  <track kind="captions" src="captions.vtt" srclang="zh" label="中文字幕">
  <track kind="descriptions" src="descriptions.vtt" srclang="zh" label="音频描述">
  您的浏览器不支持视频标签。
</video>
```

### 6. 表单可访问性

**面试问题**: "如何设计可访问的表单？"

**关键点**:
- 明确的标签关联
- 错误信息的正确传达
- 必填字段的标识
- 合理的表单结构

**示例**:
```html
<form>
  <!-- 标签关联 -->
  <label for="email">邮箱地址 <span aria-label="必填">*</span></label>
  <input 
    type="email" 
    id="email" 
    name="email" 
    required 
    aria-describedby="email-error email-help"
    aria-invalid="false"
  >
  <div id="email-help">我们不会分享您的邮箱地址</div>
  <div id="email-error" role="alert" aria-live="polite"></div>

  <!-- 单选按钮组 -->
  <fieldset>
    <legend>选择您的偏好</legend>
    <input type="radio" id="option1" name="preference" value="option1">
    <label for="option1">选项1</label>
    
    <input type="radio" id="option2" name="preference" value="option2">
    <label for="option2">选项2</label>
  </fieldset>

  <!-- 复选框 -->
  <input type="checkbox" id="newsletter" name="newsletter">
  <label for="newsletter">订阅我们的新闻通讯</label>

  <button type="submit">提交表单</button>
</form>
```

**JavaScript 表单验证**:
```javascript
function validateEmail(input) {
  const errorElement = document.getElementById('email-error');
  const isValid = input.validity.valid;
  
  if (!isValid) {
    input.setAttribute('aria-invalid', 'true');
    errorElement.textContent = '请输入有效的邮箱地址';
    errorElement.style.display = 'block';
  } else {
    input.setAttribute('aria-invalid', 'false');
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
}
```

### 7. 动态内容和 Live Regions

**面试问题**: "如何让动态更新的内容对屏幕阅读器可访问？"

**aria-live 属性**:
```html
<!-- 礼貌地通知更新 -->
<div aria-live="polite" id="status-message"></div>

<!-- 立即通知重要更新 -->
<div aria-live="assertive" id="error-message"></div>

<!-- 特定角色的 live regions -->
<div role="status" aria-live="polite">操作成功完成</div>
<div role="alert" aria-live="assertive">发生错误，请重试</div>
```

**实际应用示例**:
```javascript
// 搜索结果更新
function updateSearchResults(results) {
  const resultsContainer = document.getElementById('search-results');
  const statusMessage = document.getElementById('search-status');
  
  resultsContainer.innerHTML = generateResultsHTML(results);
  statusMessage.textContent = `找到 ${results.length} 个结果`;
}

// 表单提交状态
function handleFormSubmit() {
  const statusElement = document.getElementById('form-status');
  statusElement.textContent = '正在提交...';
  
  // 提交完成后
  setTimeout(() => {
    statusElement.textContent = '表单提交成功！';
  }, 2000);
}
```

### 8. 移动端可访问性

**面试问题**: "移动端可访问性有哪些特殊考虑？"

**关键点**:
- 触摸目标大小（至少 44x44px）
- 手势替代方案
- 屏幕方向支持
- 缩放支持

**示例**:
```css
/* 确保触摸目标足够大 */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 12px;
}

/* 支持缩放 */
@viewport {
  zoom: 1.0;
  min-zoom: 1.0;
  max-zoom: 5.0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navigation {
    font-size: 18px; /* 更大的字体 */
    line-height: 1.5;
  }
}
```

## 测试和工具

### 自动化测试工具

**常用工具**:
- **axe-core**: 自动化可访问性测试
- **Lighthouse**: Chrome 内置的可访问性审计
- **WAVE**: Web 可访问性评估工具
- **Pa11y**: 命令行可访问性测试工具

**axe-core 使用示例**:
```javascript
// 在测试中使用 axe-core
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('页面应该没有可访问性问题', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### 手动测试方法

**键盘测试**:
1. 只使用 Tab、Shift+Tab、Enter、Space、箭头键导航
2. 确保所有功能都可以通过键盘访问
3. 检查焦点顺序是否合理

**屏幕阅读器测试**:
- **Windows**: NVDA (免费)
- **macOS**: VoiceOver (内置)
- **移动端**: TalkBack (Android), VoiceOver (iOS)

**颜色对比度测试**:
- 使用 WebAIM Contrast Checker
- Chrome DevTools 的对比度检查器

## 常见面试问题和答案

### Q1: 什么是可访问性，为什么重要？

**答案要点**:
- 定义：让所有用户都能使用网站和应用
- 重要性：法律要求、道德责任、商业价值、更好的用户体验
- 受益群体：不仅是残障用户，也包括临时性障碍、环境限制等

### Q2: 如何在项目中实施可访问性？

**答案要点**:
- 从设计阶段开始考虑
- 使用语义化 HTML
- 实施 ARIA 最佳实践
- 自动化测试集成
- 定期手动测试
- 团队培训和意识提升

### Q3: 描述一次你解决可访问性问题的经历

**STAR 方法回答**:
- **Situation**: 描述遇到的可访问性问题
- **Task**: 你需要解决什么
- **Action**: 采取的具体行动
- **Result**: 最终结果和影响

### Q4: 如何平衡可访问性和设计美观？

**答案要点**:
- 可访问性和美观不冲突
- 好的设计本身就应该是可访问的
- 创新的解决方案可以两者兼顾
- 用户测试验证效果

## 最佳实践总结

### 开发阶段
1. **语义化优先**: 使用正确的 HTML 元素
2. **渐进增强**: 确保基本功能在没有 JavaScript 时也能工作
3. **键盘友好**: 所有交互都支持键盘操作
4. **清晰的标签**: 为所有表单控件提供明确的标签

### 测试阶段
1. **自动化测试**: 集成 axe-core 等工具
2. **手动测试**: 键盘导航和屏幕阅读器测试
3. **真实用户测试**: 邀请残障用户参与测试

### 维护阶段
1. **持续监控**: 定期运行可访问性测试
2. **团队培训**: 保持团队的可访问性意识
3. **文档更新**: 维护可访问性指南和最佳实践

## 学习资源

### 官方文档
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### 在线工具
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

### 学习课程
- [Web Accessibility by Google](https://www.udacity.com/course/web-accessibility--ud891)
- [Introduction to Web Accessibility](https://www.edx.org/course/introduction-to-web-accessibility)

记住，可访问性不是一个可选的功能，而是 Web 开发的基本要求。在面试中展示你对可访问性的理解和实践经验，会让你在众多候选人中脱颖而出！