
/**
 * 动态规划求阶乘
 * 注意：乘积可能超过最大值上限
 * @param {number} n 
 */
function dp(n) {
    let dp = []

    for (let i = 1; i <= n; i++) {
        if (i === 1) {
            dp[1] = 1
        } else {
            // dp[i] = dp[i - 1] * i
            dp[i] = multiply(dp[i - 1], i)
        }
    }

    return dp[n]
}

/**
 * 竖式乘积法计算大数的乘积
 * 先将数字转为字符串
 * 将乘积结果保存到数组中
 * 最后拼接文本输出
 * @param {number} num1 
 * @param {number} num2 
 */
function multiply(num1, num2) {
    if (num1 == 0 || num2 == 0) {
        return '0'
    }

    num1 = num1.toString()
    num2 = num2.toString()
    const len1 = num1.length
    const len2 = num2.length

    // 乘积最大长度，可能不一定能占满，需要注意剔除开头的若干个0
    let res = new Array(len1 + len2).fill(0)

    // 倒序，从低位（个位数）到高位数逐个数字相乘
    // 注意：低位乘积超出10，往高位进位
    for (let i = len1 - 1; i >= 0; i--) {
        for (let j = len2 - 1; j >= 0; j--) {
            let value = (+num1[i]) * (+num2[j])

            // 乘积在结果数组中的位置
            let hightIdx = i + j
            let lowIdx = i + j + 1

            let sum = res[lowIdx] + value

            // 低位
            res[lowIdx] = sum % 10

            // 高位
            res[hightIdx] = res[hightIdx] + Math.floor(sum / 10)

        }
    }

    // console.log('res:', res)

    if (res[0] == 0) {
        res.splice(0, 1)
    }

    return res.join('')
}

console.log('factorial dp 1:', dp(20));
