## 前端工程化

前端工程化具体包含：

标准化，定义编码、目录结构、接口以及源码管理等规范；
组件化，组件分为HTML、JS和CSS；
模块化，功能封装；
自动化，持续集成和持续部署。


## CI && CD

* CI[持续集成（Continuous Integration）]
* CD[持续交付（Continuous Delivery）]，也可以说是 CD[持续部署（Continuous Deployment）]

## gitlab + jenkins 持续集成

本地机器上写代码提交代码，push 到 git 远程仓库git hook 触发 jenkins 的构建 job （自动）jenkins job 中拉取项目代码，运行 npm run unit 和 npm run build，如果失败，发送邮件通知相关人。（自动）jenkins job 中执行测试服务器的部署脚本 （自动）


## github action + vercel deploy + AWS

* next.js
* react
* aws


## 参考

* [GitLab CI 前端持续集成](https://juejin.cn/post/6894530880467894286)
* [面向个人开发者应该打造的CICD部署系统](https://juejin.cn/post/7137143919418015751)