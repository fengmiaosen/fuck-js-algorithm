人们经常将跨站脚本攻击（Cross Site Scripting）缩写为CSS，但这会与层叠样式表（Cascading Style Sheets，CSS）的缩写混淆。因此，有人将跨站脚本攻击缩写为XSS

跨站脚本攻击（XSS）

* 反射型XSS

非持久化，用户通过web浏览器提交给服务端的数据，立刻用于解析和显示该用户的结果页面(数据没有在服务端存储)。如果提交的数据中含有恶意的脚本代码，而服务端没有经过编码转换或者过滤，就会形成XSS攻击，这种形式的XSS称为反射型XSS。

常见的通过浏览器地址栏输入的HTTP GET请求参数和页面搜索框输入的POST查询内容。恶意用户通过构造含恶意脚本的URL, 发送到各种群、朋友圈、邮箱，诱导用户点击，获取点击用户的信息，达到攻击目的。


* 存储型XSS

持久化，用户通过Web浏览器提交给服务端的数据，由服务端保存，然后永久显示在其他用户的页面上。如果提交的数据中含有恶意的脚本代码，而服务端在存储前或展示前没有经过编码转换或者过滤，就会形成XSS攻击，这种形式的XSS称为存储型XSS。

这种场景通常是用户的留言、评论中含有恶意脚本，存储在了服务器中，普通用户访问到就会受到攻击，理论上该Web应用的任何用户都是攻击对象



* [根据白名单过滤 HTML(防止 XSS 攻击)](https://github.com/leizongmin/js-xss/blob/master/README.zh.md)