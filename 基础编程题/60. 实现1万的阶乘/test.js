
// 方法一 动态规划
// 数值上限溢出
function factorial(n) {

    let dp = []
    dp[0] = 1
    dp[1] = 1

    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] * i;
    }

    return dp[n]
}

/**
 * 
 * @param {string} num1 
 * @param {string} num2 
 * @returns 
 */
function multiply(num1, num2) {
    if (num1 == '0' || num2 == '0') {
        return '0'
    }

    if (num1 == '1') {
        return num2;
    }

    if (num2 == '1') {
        return num1;
    }

    let m = num1.length
    let n = num2.length

    // 结果数值最大长度为m+n
    let res = new Array(m + n).fill(0)

    // 倒序计算每个数字字符的乘积
    // 竖式计算法
    for (let i = m - 1; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
            let value = (+num1[i]) * (+num2[j])

            // 关键是确定乘积结果在数组中的低位、高位索引
            // 低位是右侧，高位是左侧，跟数组索引高低相反
            let highIdx = i + j
            let lowIdx = i + j + 1

            // 先计算低位数值
            let sum = res[lowIdx] + value

            res[lowIdx] = sum % 10

            // 高位数字进位的时候只有0或者1两种选择
            res[highIdx] = res[highIdx] + Math.floor(sum / 10)

        }
    }

    let strs = []
    // 数组首位可能有初始化填充的0，需要移除
    res.forEach((v, index) => {
        if (v == 0 && index === 0) {

        } else {
            strs.push(v);
        }
    })

    return strs.join('')

}

// 方法二 
// 动态规划 + 字符串相乘
function factorial2(n) {

    let dp = []
    dp[0] = 1
    dp[1] = 1

    for (let i = 2; i <= n; i++) {
        dp[i] = multiply(dp[i - 1] + '', i + '');
    }

    return dp[n]
}

console.log('factorial dp1:', factorial(10));

console.log('multiply string:', multiply('19', '20'));

console.log('factorial dp2:', factorial2(10));
