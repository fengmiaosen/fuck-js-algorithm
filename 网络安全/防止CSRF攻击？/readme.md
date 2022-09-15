
## 什么是CSRF

`CSRF（Cross-site request forgery）` 跨站请求伪造

* 攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。
* 利用受害者在被攻击网站已经获取的注册凭证，绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的

## CSRF 防护策略

* CSRF自动防御策略：同源检测（Origin 和 Referer 验证）。
* CSRF主动防御措施：Token验证 或者 双重Cookie验证 以及配合Samesite Cookie。
* 保证页面的幂等性，后端接口不要在GET页面中做用户操作

## 参考

https://tech.meituan.com/2018/10/11/fe-security-csrf.html

* [前后端分离架构下CSRF防御机制](https://segmentfault.com/a/1190000006944760)
* [浅谈CSRF攻击方式](https://www.cnblogs.com/hyddd/archive/2009/04/09/1432744.html)