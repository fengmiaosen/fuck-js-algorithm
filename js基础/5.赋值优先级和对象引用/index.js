var a = {n: 1};
var b = a;

a.x = a = {n: 2};

console.log(a.x) 	
console.log(b)
console.log(b.x)

//参考 https://muyiy.cn/question/js/53.html
// 这个问题考察的知识点主要有以下这些：

// . 的优先级高于 = 的优先级
// = 具有右结合性（执行的方向是从右往左，先执行 = 右边的表达式，然后把结果赋值给 = 左边的表达式，从这里可以得出 = 属于二元操作符），多个 = 的执行过程，可以类比成"递归"的过程