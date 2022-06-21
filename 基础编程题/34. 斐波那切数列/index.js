// https://labuladong.github.io/algo/1/5/#一斐波那契数列


/**
 * 方法一
 * 动态规划
 * @param {number}} num 
 */
function fn(num) {
    let dp = []
    dp[0] = 1
    dp[1] = 1

    for (let i = 2; i <= num; i++) {
        dp[i] = dp[i - 1] + dp[i - 2]
    }

    return dp[num]
}

console.time('fn')
console.log('num dp:', fn(50))
console.timeEnd('fn')

/**
 * 方法二
 * 递归实现
 * @param {number} num 
 */
function getNum(num) {
    if (num < 2) {
        return 1;
    }

    return getNum(num - 2) + getNum(num - 1);
}

console.time('num')
console.log('num 10:', getNum(40))
console.timeEnd('num')