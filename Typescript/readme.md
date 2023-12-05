
### type 与 interface的区别

接口 interface：接口的作用就是为这些类型命名和为你的代码或第三方代码定义数据模型。 
类型别名：type (类型别名)会给一个类型起个新名字。 

* type 有时和 interface 很像，但是可以作用于原始值（基本类型），联合类型，元组以及其它任何你需要手写的类型。
* 与类型别名不同，接口可以定义多次，会被自动合并为单个接口。
* 两者都可以扩展，接口 interface 通过 extends 来实现。类型别名 type 的扩展就是交叉类型，通过 & 来实现。

### infer

https://jkchao.github.io/typescript-book-chinese/tips/infer.html


### 参考资料

* [TS常用特性总结](https://juejin.cn/post/7119300462821507103)