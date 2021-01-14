//改造代码使之输出0-9
for (var i = 0; i < 10; i++) {
    setTimeout(() => {
        console.log(i);
    }, 1000);
}

// 方法一
for (var i = 0; i < 10; i++) {
    (function (i) {
        setTimeout(() => {
            console.log('new i:', i);
        }, 1000);
    })(i);
}

//方法二
for (var i = 0; i < 10; i++) {
    setTimeout((i) => {
        console.log('set i:', i);
    }, 1000, i);
}