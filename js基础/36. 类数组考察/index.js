// 看文档：
// 1：push 方法根据 length 属性来决定从哪里开始插入给定的值。
// 2：push 是特意设计为通用的，Array.prototype.push 可以在一个对象上工作。

// 解析：
// 原题 length = 2。所以当然从第三个开始push，而obj中index为2和3的都被占用了。自然会替换掉。

// 所以：很得到的答案很明显。


var obj = {
    '2': 3,
    '3': 4,
    'length': 2,
    'splice': Array.prototype.splice,
    'push': Array.prototype.push
}
obj.push(11)
obj.push(22)
console.log(obj)

