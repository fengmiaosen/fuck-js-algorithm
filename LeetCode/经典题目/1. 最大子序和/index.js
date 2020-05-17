// 53. 最大子序和

// https://leetcode-cn.com/problems/maximum-subarray/description/

// 给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

// 示例:

// 输入: [-2,1,-3,4,-1,2,1,-5,4],
// 输出: 6
// 解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。
// 进阶:

// 如果你已经实现复杂度为 O(n) 的解法，尝试使用更为精妙的分治法求解。

/**
 * 方法一：动态规划
 * 参考 https://leetcode-cn.com/problems/maximum-subarray/solution/hua-jie-suan-fa-53-zui-da-zi-xu-he-by-guanpengchn/
 * 从头开始连续求和
 * 在此过程中先与当前元素比较取最大值
 * 然后sum跟预定义的max比较，计算最大和
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

const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];

console.log('max sum:', getMaxSum(nums))