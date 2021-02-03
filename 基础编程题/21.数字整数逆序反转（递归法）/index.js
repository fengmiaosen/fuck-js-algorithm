// 输入 int 型，返回整数逆序后的字符串。如：输入整型 1234，返回字符串“4321”。
// 要求必须使用递归函数调用，不能用全局变量，输入函数必须只有一个参数传入，必须返回字符串

function fun(num) {

    // 最后一位
    let lastNum = num % 10;

    // 除了最后一位的前几位
    let restNum = Math.floor(num / 10);

    if (restNum < 1) {
        return num;
    } else {
        let otherNum = fun(restNum);

        return `${lastNum}${otherNum}`
    }
}

console.log('reverse num:', fun(1234567899));