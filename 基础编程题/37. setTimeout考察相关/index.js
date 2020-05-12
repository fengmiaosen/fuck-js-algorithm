// 改造下面的代码，使之输出0 - 9，写出你能想到的所有解法

for (var i = 0; i< 10; i++){
	setTimeout(() => {
		console.log(i);
    }, 1000)
}


// ======>
// 方法一
for (var i = 0; i< 10; i++){
	((i) => {
        setTimeout(() => {
            console.log('new value:', i);
        }, 1000)
    })(i);
}

// 方法二
for (var i = 0; i< 10; i++){
	setTimeout((i) => {
		console.log('new value xxx:', i);
    }, 1000, i)
}