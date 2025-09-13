
### 什么是 CSRF

**跨站请求伪造（CSRF, Cross-Site Request Forgery）** 是一种网络攻击方式，攻击者通过伪造用户的请求，利用用户在浏览器中已认证的身份，执行未授权的操作。CSRF 攻击通常发生在用户已登录的情况下，用户在不知情的情况下向受信任的网站发送请求，造成恶意操作。

#### CSRF 攻击的工作原理

1. 用户在网站 A 登录并保持会话。
2. 用户访问恶意网站 B，网站 B 通过 `<img>` 标签、表单提交或 AJAX 请求，向网站 A 发起请求。
3. 因为用户的浏览器会自动携带网站 A 的认证信息（如 Cookies），网站 A 将此请求视为合法请求，从而执行相应操作。

### 如何防范 CSRF

防范 CSRF 攻击的常用方法包括：

#### 1. **使用 CSRF Token**

在每个敏感操作的表单中添加一个随机生成的 CSRF Token。服务器在处理请求时验证该 Token。

- **生成 Token**：
    - 在用户登录时生成一个唯一的 Token，并将其存储在服务器端。
    - 将该 Token 嵌入到每个表单中。

- **验证 Token**：
    - 服务器在处理请求时，检查请求中的 Token 是否与存储的一致。

```html
<form action="/submit" method="POST">
    <input type="hidden" name="csrf_token" value="random_token_here">
    <!-- 其他表单字段 -->
</form>
```

#### 2. **使用 SameSite Cookie 属性**

将 Cookie 的 SameSite 属性设置为 `Strict` 或 `Lax`，可以限制跨站请求携带 Cookie。

```http
Set-Cookie: sessionId=abc123; SameSite=Strict
```

#### 3. **检查 Referer 或 Origin 头**

在处理请求时，检查请求的 Referer 或 Origin 头，确保请求来自可信的来源。

- 注意，这种方法可能会受到某些浏览器隐私设置的影响。

#### 4. **使用双重提交 Cookie**

在每个请求中同时携带 CSRF Token 和 Cookie，服务器检查两者是否一致。

1. 用户登录时，服务器生成一个 CSRF Token，并将其放入 Cookie。
2. 用户的请求中需要包含这个 Token，服务器验证。

#### 5. **限制敏感操作**

对于敏感操作（如资金转账、账户修改等），要求用户进行额外的身份验证，如输入密码或二次验证。

### 总结

CSRF 是一种常见的网络攻击方式，可以通过多种措施进行防范。最有效的防范方法是使用 CSRF Token，这样可以确保请求的合法性。同时，结合使用其他措施，如 SameSite Cookie 和检查请求头，可以进一步增强安全性。


### token 防御CSRF

token防御的整体思路是：

第一步：后端随机产生一个token，把这个token保存在SESSION状态中；同时，后端把这个token交给前端页面；

第二步：下次前端需要发起请求（比如发帖）的时候把这个token加入到请求数据或者头信息中，一起传给后端；

第三步：后端校验前端请求带过来的token和SESSION里的token是否一致；

上文提到过，前后端分离状态下，Nodejs是不具备SESSION功能的。那这种token防御机制是不是就无法实现了呢？

肯定不是。我们可以借助cookie把这个流程升级下：

第一步：后端随机产生一个token，基于这个token通过SHA-56等散列算法生成一个密文；

第二步：后端将这个token和生成的密文都设置为cookie，返回给前端；

第三步：前端需要发起请求的时候，从cookie中获取token，把这个token加入到请求数据或者头信息中，一起传给后端；

第四步：后端校验cookie中的密文，以及前端请求带过来的token，进行正向散列验证；

当然这样实现也有需要注意的：

散列算法都是需要计算的，这里会有性能风险；

token参数必须由前端处理之后交给后端，而不能直接通过cookie；

cookie更臃肿，会不可避免地让头信息更重；


### 参考

https://tech.meituan.com/2018/10/11/fe-security-csrf.html

* [前后端分离架构下CSRF防御机制](https://segmentfault.com/a/1190000006944760)
* [浅谈CSRF攻击方式](https://www.cnblogs.com/hyddd/archive/2009/04/09/1432744.html)