/**
 * 
 * @param {string} value 金额字符串
 * @returns {string} 格式化后的金额字符串
 */
function formatMoney(value) {
    if (value.length < 3) {
        return value;
    }

    let len = value.length
    let start = len % 3 || 3;
    let arr = [value.slice(0, start)];

    while (start < len) {
        arr.push(value.slice(start, start + 3));
        start += 3;
    }

    return arr.join(',');
}

console.log(formatMoney('999999988'));
console.log(formatMoney('1999999988'));
console.log(formatMoney('41234567890'));