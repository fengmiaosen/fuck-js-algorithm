
function convert(num) {

    //获取最后一位数字
    const lastNum = num % 10;

    // 获取前面剩余的数字串
    const otherNum = Math.floor(num / 10);

    if (otherNum < 1) {
        return num;
    } else {
        const res = convert(otherNum);

        return `${lastNum}${res}`;
    }

}

console.log('num:', convert(123456));