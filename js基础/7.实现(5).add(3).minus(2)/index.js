// 例如实现 5+3-2=6

// 方法一
// 给Number对象添加方法
Number.prototype.add = function (i = 0) {
    return this.valueOf + i;
};

Number.prototype.minus = function (i = 0) {
    return this.valueOf - i;
};

console.log('5+3-2=', (5).add(3).minus(2));