
/**
 * 
 * @param {number} value 
 */
function fn(value) {

    //获取个位数
    const lastNum = value % 10;

    // 获取前面的高位数
    const otherNum = Math.floor(value / 10);

    if (otherNum < 1) {
        return value;
    } else {
        const num = fn(otherNum);

        return `${lastNum}${num}`;
    }
}

console.log(fn(12345679));