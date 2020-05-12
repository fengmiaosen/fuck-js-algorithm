//非匿名自执行函数，函数名只读
//参考 https://segmentfault.com/q/1010000002810093
var b = 10;
(function b(){
    b = 20;
    console.log(b); 
})();


// 题目2
// 变量提升
var a = 10;
(function () {
    console.log(a)
    a = 5
    console.log(window.a)
    var a = 20;
    console.log(a)
})()
