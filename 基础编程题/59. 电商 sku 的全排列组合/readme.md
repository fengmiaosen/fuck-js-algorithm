需求描述起来很简单，有这样三个数组：

let names = ["iPhone X", "iPhone XS"]

let colors = ["黑色", "白色"]

let storages = ["64g", "256g"]
需要把他们的所有组合穷举出来，最终得到这样一个数组：

[
  ["iPhone X", "黑色", "64g"],
  ["iPhone X", "黑色", "256g"],
  ["iPhone X", "白色", "64g"],
  ["iPhone X", "白色", "256g"],
  ["iPhone XS", "黑色", "64g"],
  ["iPhone XS", "黑色", "256g"],
  ["iPhone XS", "白色", "64g"],
  ["iPhone XS", "白色", "256g"],
]

### 参考

https://cloud.tencent.com/developer/article/1645756