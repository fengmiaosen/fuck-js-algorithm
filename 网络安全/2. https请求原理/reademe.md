

[一次安全可靠的通信——HTTPS原理](https://developers.weixin.qq.com/community/develop/article/doc/000046a5fdc7802a15f7508b556413)

![https](https://imgkr.cn-bj.ufileos.com/7c9d2e38-6910-47b0-8712-e8f3e44872aa.png)


* 客户端使用https的url访问web服务器,要求与服务器建立ssl连接
* web服务器收到客户端请求后, 会将网站的证书(包含公钥)传送一份给客户端
* 客户端收到网站证书后会（根据操作系统或者浏览器内置）检查证书的颁发机构以及过期时间, 如果没有问题就随机产生一个秘钥
* 客户端利用公钥将会话秘钥加密, 并传送给服务端, 服务端利用自己的私钥解密出会话秘钥
* 之后服务器与客户端使用秘钥加密传输
