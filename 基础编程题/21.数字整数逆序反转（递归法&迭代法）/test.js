// 输入 int 型，返回整数逆序后的字符串。如：输入整型 1234，返回字符串“4321”。
// 要求必须使用递归函数调用，不能用全局变量，输入函数必须只有一个参数传入，必须返回字符串
function reverse(num) {

    let last = num % 10;
    let rest = Math.floor(num / 10);

    if (rest < 1) {
        return num;
    } else {
        let other = reverse(rest);
        return `${last}${other}`;
    }
}

// 迭代法
function reverse2(num) {
    if(num < 10) {
        return num;
    }

    let res = 0;
    while(num > 0) {

        // 边界判断
        if(res > Math.pow(2, 31) / 10) {
            return 0;
        }

        if(res < Math.pow(-2, 31) / 10) {
            return 0;
        }

        // 获取最后一位数字
        let last = num % 10;

        // 将最后一位数字拼接到结果中
        res = res * 10 + last;

        // 去掉最后一位数字
        num = Math.floor(num / 10);
    }

    return res;
}

console.log(reverse(123456));
console.log(reverse2(123456));