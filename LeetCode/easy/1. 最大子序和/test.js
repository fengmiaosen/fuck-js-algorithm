// 输入: [-2,1,-3,4,-1,2,1,-5,4],
// 输出: 6
// 解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。

function getMaxSum(arrs) {
    let sum = 0
    let res = 0

    for (let value of arrs) {
        if (sum > 0) {
            sum += value
        } else {
            sum = value
        }
        res = Math.max(sum, res)
    }

    return res
}

// 原始的 动态规划 DP 是这样的：
// Java代码
// public int maxSubArray(int[] nums) {
//   int n = nums.length;
//   int[] dp = new int[n];
//   dp[0] = nums[0];

//   int max = nums[0];
//   for (int i = 1; i < n; i++) {
//     dp[i] = Math.max(dp[i- 1] + nums[i], nums[i]);
//     max = Math.max(max, dp[i]);
//   }

//   return max;
// }

/**
 * 
 * @param {array} nums 
 */
function getMaxSum2(nums) {
    let len = nums.length
    let dp = new Array(len).fill(0)
    let max = 0

    dp[0] = nums[0]
    for (let i = 1; i < len; i++) {
        dp[i] = Math.max(dp[i - 1] + nums[i], nums[i])
        max = Math.max(max, dp[i])
    }

    return max
}


const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];

console.log('max sum:', getMaxSum(nums))

console.log('max sum2:', getMaxSum2(nums))
