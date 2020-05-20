function parseToMoney(num) {
    num = parseFloat(num.toFixed(3));

    let [integer, decimal] = String.prototype.split.call(num, '.');

    //(?=p)，其中 p 是一个子模式，即 p 前面的位置，或者说，该位置后面的字符要匹配 p。
    integer = integer.replace(/\d(?=(\d{3})+$)/g, '$&,');
    
    return integer + '.' + (decimal ? decimal : '');
}

// 保留三位小数
console.log(parseToMoney(1234.56)); // return '1,234.56'
console.log(parseToMoney(123456789)); // return '123,456,789'
console.log(parseToMoney(1087654.321)); // return '1,087,654.321'


