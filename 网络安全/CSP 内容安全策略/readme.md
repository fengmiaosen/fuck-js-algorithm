 
内容安全策略（CSP，Content Security Policy）是一个强大的安全功能，旨在帮助防止跨站脚本（XSS）和其他代码注入攻击。
CSP 通过允许开发者定义哪些资源可以被浏览器加载，从而减少恶意内容的执行风险。

### CSP 的工作原理

CSP 通过在 HTTP 响应头或 HTML `<meta>` 标签中定义的一组规则，告知浏览器允许加载哪些内容。这些规则可以包括脚本、样式、图像、字体等的来源。

### CSP 的基本语法

CSP 使用指令来指定不同类型的内容源。以下是一些常见的 CSP 指令：

- **default-src**: 默认来源，如果未指定具体的来源，则使用该指令。
- **script-src**: 允许加载 JavaScript 的来源。
- **style-src**: 允许加载 CSS 的来源。
- **img-src**: 允许加载图像的来源。
- **font-src**: 允许加载字体的来源。
- **connect-src**: 允许进行 AJAX 和 WebSocket 请求的来源。
- **frame-src**: 允许加载 iframe 的来源。

### 示例 CSP 头

以下是一个简单的 CSP 头的示例：

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://apis.example.com; style-src 'self' 'unsafe-inline';
```

bing 搜索的示例

```http
content-security-policy: script-src https: 'strict-dynamic' 'report-sample' 'wasm-unsafe-eval' 'nonce-8SRufP5CfH3/z+7NhDaPXIrBSeyCJFtYU5zscIou2tI='; base-uri 'self';report-to csp-endpoint
```

在这个示例中：
- `default-src 'self'`: 只允许从同源加载资源。
- `script-src 'self' https://apis.example.com`: 允许从同源和 `https://apis.example.com` 加载脚本。
- `style-src 'self' 'unsafe-inline'`: 允许从同源加载样式，并允许内联样式（不推荐，增加风险）。

### CSP 的优势

1. **防止 XSS 攻击**: CSP 可以有效阻止攻击者注入和执行恶意脚本。
2. **资源控制**: 通过明确指定可信的内容源，减少了攻击面。
3. **报告机制**: CSP 还可以配置报告功能，允许开发者接收违反 CSP 规则的报告，帮助识别安全问题。

### CSP 的挑战

1. **配置复杂性**: 配置 CSP 可能比较复杂，尤其是在大型应用中，需要仔细规划哪些资源是必要的。
2. **兼容性问题**: 旧版浏览器可能不支持 CSP，尽管大多数现代浏览器都已支持。
3. **误报**: 过于严格的 CSP 可能导致误报，影响正常功能。

### 实施 CSP 的最佳实践

1. **从报告开始**: 使用 `Content-Security-Policy-Report-Only` 头，观察违反情况，调整策略。
2. **逐步实施**: 逐步添加 CSP 规则，避免一次性部署过于严格的策略。
3. **避免使用 `'unsafe-inline'` 和 `'unsafe-eval'`**: 尽量避免使用这些选项，因为它们降低了 CSP 的有效性。
4. **使用 nonce 或 hash**: 对于内联脚本和样式，使用 nonce（一次性令牌）或 hash 值，提高安全性。

### 总结

内容安全策略（CSP）是防止 XSS 和代码注入攻击的重要工具，通过明确的资源加载规则，帮助开发者提高网站的安全性。合理配置和实施 CSP 可以显著增强应用的防护能力。


* [Upgrade Insecure Requests Sample](https://googlechrome.github.io/samples/csp-upgrade-insecure-requests/index.html)
* [CSP nonce](http://www.alloyteam.com/2020/08/csp-nonce/)
* https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP
* https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Upgrade-Insecure-Requests#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7
* https://www.cnblogs.com/hustskyking/p/upgrade-insecure-requests.html