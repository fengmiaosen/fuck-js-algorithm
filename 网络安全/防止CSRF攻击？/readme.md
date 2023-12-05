
## 什么是CSRF

`CSRF（Cross-site request forgery）` 跨站请求伪造

* 攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。
* 利用受害者在被攻击网站已经获取的注册凭证，绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的

## CSRF 防护策略

* CSRF自动防御策略：同源检测（Origin 和 Referer 验证）。
* CSRF主动防御措施：Token验证 或者 双重Cookie验证 以及配合Samesite Cookie。
* 保证页面的幂等性，后端接口不要在GET页面中做用户操作


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


## 参考

https://tech.meituan.com/2018/10/11/fe-security-csrf.html

* [前后端分离架构下CSRF防御机制](https://segmentfault.com/a/1190000006944760)
* [浅谈CSRF攻击方式](https://www.cnblogs.com/hyddd/archive/2009/04/09/1432744.html)