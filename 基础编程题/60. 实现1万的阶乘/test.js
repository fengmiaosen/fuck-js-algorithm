
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


console.log('factorial dp:', factorial(10));