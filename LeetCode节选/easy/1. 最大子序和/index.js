// 53. 最大子序和

// https://leetcode-cn.com/problems/maximum-subarray/description/

// 给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

// 示例:

// 输入: [-2,1,-3,4,-1,2,1,-5,4],
// 输出: 6
// 解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。
// 进阶:

// 如果你已经实现复杂度为 O(n) 的解法，尝试使用更为精妙的分治法求解。

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
 * 方法一：动态规划
 * 参考 https://leetcode-cn.com/problems/maximum-subarray/solution/hua-jie-suan-fa-53-zui-da-zi-xu-he-by-guanpengchn/
 * 从头开始连续求和
 * 在此过程中先与当前元素比较取最大值
 * 然后sum跟预定义的max比较，计算最大和
 * 
 *  其实这道题可以这么想：
 *  1.假如全是负数，那就是找最大值即可，因为负数肯定越加越小。 
 *  2.如果有正数，则肯定从正数开始计算和，不然前面有负值，和肯定变小了，所以从正数开始。 
 *  3.当和小于零时，这个区间就告一段落了，然后从下一个正数重新开始计算(也就是又回到 2 了)。而 dp 也就体现在这个地方。
 * @param {array} nums 
 */
function getMaxSum(nums) {

    let sum = 0;
    let res = 0;

    for (let num of nums) {
        // sum = Math.max(sum + num, num);
        //代码等同于上面的max取值
        if (sum > 0) {
            sum += num;
        } else {
            sum = num;
        }

        res = Math.max(res, sum);
    }

    return res;

}

/**
 * Dynamic programming
 * 方法二：标准的动态规划dp
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