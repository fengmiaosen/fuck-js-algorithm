


### 跨域和跨站

首先要理解的一点就是跨站和跨域是不同的。同站(same-site)/跨站(cross-site)」和第一方(first-party)/第三方(third-party)是等价的。
但是与浏览器同源策略（SOP）中的「同源(same-origin)/跨域(cross-origin)」是完全不同的概念。

* 同源策略的同源是指两个 URL 的`协议/主机名/端口`一致。例如，https://www.taobao.com/pages/...，它的协议是 https，主机名是 www.taobao.com，端口是 443。

同源策略作为浏览器的安全基石，其「同源」判断是比较严格的

* 相对而言，Cookie中的`「同站」`判断就比较宽松：只要两个 URL 的 eTLD+1 相同即可，`不需要考虑协议和端口`。

eTLD 表示有效顶级域名，注册于 Mozilla 维护的公共后缀列表（Public Suffix List）中，例如，.com、.co.uk、.github.io 等。
eTLD+1 则表示，有效顶级域名+二级域名，例如 taobao.com 等。

举几个例子，www.taobao.com 和 www.baidu.com 是跨站，www.a.taobao.com 和 www.b.taobao.com 是同站，a.github.io 和 b.github.io 是跨站(注意是跨站)。


* [浏览器系列之 Cookie 和 SameSite 属性](https://github.com/mqyqingfeng/Blog/issues/157)


Cookie 和 SameSite 属性是现代 Web 安全的重要组成部分，让我详细介绍一下：

## Cookie 基础

Cookie 是服务器发送到用户浏览器并保存在本地的小型数据片段，主要用于：
- 会话管理（登录状态、购物车等）
- 个性化设置（用户偏好、主题等）
- 跟踪分析（用户行为统计）

## SameSite 属性的背景

SameSite 属性是为了防止跨站请求伪造（CSRF）攻击而引入的安全机制。它控制 Cookie 在跨站请求中的发送行为。

## SameSite 的三个值

### 1. SameSite=Strict（最严格）
```http
Set-Cookie: sessionid=abc123; SameSite=Strict
```
- 只有在同站请求时才发送 Cookie
- 从第三方网站链接跳转过来时，不会携带 Cookie
- 安全性最高，但用户体验可能受影响

**示例场景：**
用户在社交媒体上点击银行网站链接，由于 SameSite=Strict，用户需要重新登录。

### 2. SameSite=Lax（默认值）
```http
Set-Cookie: sessionid=abc123; SameSite=Lax
```
- 大部分跨站请求不发送 Cookie
- 但允许部分"安全"的跨站请求（如 GET 导航）
- 平衡了安全性和可用性

**允许的情况：**
- 通过链接导航（`<a>` 标签）
- 表单 GET 请求
- 预加载请求

**不允许的情况：**
- 表单 POST 请求
- iframe 嵌入
- AJAX 请求
- 图片等资源请求

### 3. SameSite=None（最宽松）
```http
Set-Cookie: sessionid=abc123; SameSite=None; Secure
```
- 所有跨站请求都发送 Cookie
- 必须配合 Secure 属性使用（HTTPS）
- 适用于需要跨站功能的场景

## 实际应用场景

### 第三方支付集成
```javascript
// 支付页面需要跨站携带用户信息
document.cookie = "payment_session=xyz789; SameSite=None; Secure";
```

### 嵌入式小部件
```html
<!-- 第三方评论系统 -->
<iframe src="https://comments.example.com/widget"></iframe>
```
评论系统需要 `SameSite=None` 来维持用户登录状态。

### 单点登录（SSO）
```http
Set-Cookie: sso_token=token123; SameSite=Lax; Domain=.company.com
```

## 浏览器兼容性变化

**Chrome 80+ 的重要变化：**
- 默认 SameSite 值从 None 改为 Lax
- SameSite=None 必须配合 Secure 使用

**检测浏览器支持：**
```javascript
function isSameSiteSupported() {
    const testCookie = 'test=1; SameSite=Strict';
    document.cookie = testCookie;
    const supported = document.cookie.includes('test=1');
    // 清理测试 Cookie
    document.cookie = 'test=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    return supported;
}
```

## 最佳实践

### 1. 根据用途选择合适的 SameSite 值
```javascript
// 敏感操作使用 Strict
document.cookie = "admin_session=abc; SameSite=Strict; Secure";

// 一般用户会话使用 Lax
document.cookie = "user_session=def; SameSite=Lax; Secure";

// 跨站功能使用 None
document.cookie = "tracking_id=ghi; SameSite=None; Secure";
```

### 2. 渐进式降级
```javascript
function setCrossSiteCookie(name, value) {
    // 现代浏览器
    document.cookie = `${name}=${value}; SameSite=None; Secure`;
    
    // 降级方案（旧浏览器）
    if (!isSameSiteSupported()) {
        document.cookie = `${name}=${value}; Secure`;
    }
}
```

### 3. 服务端设置示例
```javascript
// Express.js
app.use(session({
    cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    }
}));
```

## 调试和排查

### 1. 开发者工具检查
在浏览器开发者工具的 Application/Storage 面板查看 Cookie 的 SameSite 属性。

### 2. 网络面板分析
观察跨站请求是否正确携带了 Cookie。

### 3. 常见问题排查
```javascript
// 检查 Cookie 是否被正确设置
function debugCookie(name) {
    const cookies = document.cookie.split(';');
    const cookie = cookies.find(c => c.trim().startsWith(name));
    console.log(`Cookie ${name}:`, cookie || 'Not found');
}
```

## 未来发展

随着隐私保护意识的增强，浏览器将继续加强 Cookie 的限制：
- 第三方 Cookie 的逐步淘汰
- 更严格的跨站请求控制
- 新的隐私保护机制（如 Privacy Sandbox）

理解和正确使用 SameSite 属性对于构建安全、可靠的 Web 应用至关重要。在实际开发中，需要根据具体的业务场景和安全要求来选择合适的策略。