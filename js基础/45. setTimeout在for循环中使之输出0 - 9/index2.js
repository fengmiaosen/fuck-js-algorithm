// 要求：
// 1、只能修改 setTimeout 到 Math.floor(Math.random() * 1000 的代码
// 2、不能修改 Math.floor(Math.random() * 1000
// 3、不能使用全局变量

// 原始代码
function print(n) {
    setTimeout(() => {
        console.log(n);
    }, Math.floor(Math.random() * 1000));
}

for (var i = 0; i < 100; i++) {
    // print1(i);
    print2(i);
    // print3(i);
}

// 方法一：修改后的代码
//实现原理：闭包，匿名函数自执行 ，即使创建它的上下文已经销毁，变量仍然存在
function print1(n) {
    setTimeout((
        () => {
            console.log(n);
            return () => { };
        }
    )(), Math.floor(Math.random() * 1000));
}

// 方法二：
// 利用 setTimeout 接受多个参数的方法，将Math.floor(Math.random() * 1000)作为第三个参数，第二参数可以设置为任意值
function print2(n) {
    setTimeout(() => {
        console.log(n);
    }, 1, Math.floor(Math.random() * 1000));
}

// 方法三
function print3(n) {

    setTimeout((() => {
        console.log(n);

        return () => { };
    }).call(null, n), Math.floor(Math.random() * 1000))
}