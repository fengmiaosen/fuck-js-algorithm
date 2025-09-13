//非匿名自执行函数，函数名只读
// 参考 https://segmentfault.com/q/1010000002810093
// 执行结果： 输出 [Function: b]

// 原理解释：

// - 在非匿名自执行函数中，函数名 b 在函数内部是只读的
// - 尝试给 b 赋值 20 是无效的，不会改变函数名的引用
// - console.log(b) 输出的是函数本身
var b = 10;
(function b(){
    b = 20; // 此段代码是无效的
    console.log(b); 
})();


// 题目2
// 原理解释：
// - 由于变量提升，函数内部的 var a 声明被提升到函数顶部
// - 函数执行时，局部变量 a 已声明但未初始化，所以第一次输出是 undefined
// - a = 5 给局部变量赋值
// - window.a 在Node.js环境中不存在，因为Node.js没有window对象
// - 最后 var a = 20 完成初始化，输出 20

var a = 10;
(function () {
    console.log('a:', a)
    a = 5
    console.log('window.a:', window.a)
    // 变量提升
    var a = 20;
    console.log(a)
})()
