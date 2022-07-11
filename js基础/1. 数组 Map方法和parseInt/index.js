//参考 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt
// parseInt('123', 5) // 将'123'看作5进制数，返回十进制数38 => 1*5^2 + 2*5^1 + 3*5^0 = 38

// 如果 radix 是 undefined、0或未指定的，JavaScript会假定以下情况：

// 如果输入的 string以 "0x"或 "0x"（一个0，后面是小写或大写的X）开头，那么radix被假定为16，字符串的其余部分被当做十六进制数去解析。
// 如果输入的 string以 "0"（0）开头， radix被假定为8（八进制）或10（十进制）。具体选择哪一个radix取决于实现。ECMAScript 5 澄清了应该使用 10 (十进制)，但不是所有的浏览器都支持。因此，在使用 parseInt 时，一定要指定一个 radix。
// 如果输入的 string 以任何其他值开头， radix 是 10 (十进制)。
// 如果第一个字符不能转换为数字，parseInt会返回 NaN。

var res = ['1', '2', '3', '10'].map(parseInt);

// 等同于
var res = ['1', '2', '3', '10'].map((item, index) => {
    return parseInt(item, index);
})

console.log('parseInt:', res);

// 数字转换为二进制字符串
let num = 10
console.log('num:', num.toString(2))