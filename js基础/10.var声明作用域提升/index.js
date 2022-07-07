// var 声明的变量没有块作用域，变量会提升到最近的 function 作用域的上层，但此时只是声明了变量，并没有赋值，到实际运行了赋值语句之后才有值，在之前值为 undefined
// https://muyiy.cn/question/js/108.html

var name = 'Tom';
(function () {
    console.info('name', name);
    console.info('typeof name', typeof name);
    
    if (typeof name == 'undefined') {
        var name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})();


//情形2：
var name = 'Tom';
(function () {
    if (typeof name == 'undefined') {
        name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})();