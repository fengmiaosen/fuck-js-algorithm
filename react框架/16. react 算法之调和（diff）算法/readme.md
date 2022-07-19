
## 基本原理

比较对象: fiber对象与ReactElement对象相比较.

注意: 此处有一个误区, 并不是两棵 fiber 树相比较, 而是旧fiber对象与新ReactElement对象向比较, 结果生成新的fiber子节点.
可以理解为输入ReactElement, 经过reconcileChildren()之后, 输出fiber.

## 比较方案:
单节点比较
可迭代节点比较



* [React 算法之调和算法](https://7kms.github.io/react-illustration-series/algorithm/diff/)
