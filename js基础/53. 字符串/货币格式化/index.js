// 99999888 => 99,999,888

/**
 * 
 * @param {string} value 金额字符串
 * @returns {string} 格式化后的金额字符串
 */
function formatMoney(value) {

    let len = value.length;

    if (len < 3) {
        return value;
    }

    // 计算字符串长度除以3的余数作为起始位置
    // 如果余数为0，则使用3作为起始位置，避免出现空的第一组
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

// 参考资料
// https://juejin.cn/post/6844904040912912397