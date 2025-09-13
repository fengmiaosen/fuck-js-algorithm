// 例如实现 5+3-2=6

// 方法一
// Add methods to Number prototype
Number.prototype.add = function (i = 0) {
    // Need to use valueOf() as a method call
    return this.valueOf() + i;
};

Number.prototype.minus = function (i = 0) {
    // Need to use valueOf() as a method call
    return this.valueOf() - i;
};

// Test the implementation
console.log('5+3-2=', (5).add(3).minus(2));