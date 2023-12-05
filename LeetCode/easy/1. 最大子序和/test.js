
function getMaxSum(nums) {
    let len = nums.length
    let dp = new Array(len).fill(0)
    let max = 0

    dp[0] = nums[0]

    for (let i = 1; i < len; i++) {
        dp[i] = Math.max(dp[i - 1] + nums[i], nums[i])
        max = Math.max(dp[i], max)
    }
    return max
}

const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];

console.log('max sum:', getMaxSum(nums))