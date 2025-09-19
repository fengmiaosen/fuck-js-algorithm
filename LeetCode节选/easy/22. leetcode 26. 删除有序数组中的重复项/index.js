/**
 * 思路与 [移动零] 的实现一致
 * https://leetcode.cn/problems/move-zeroes/
 * @param {number[]} nums
 * @return {number}
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 */
var removeDuplicates = function (nums) {
    let slow = 0

    for (let i = 1; i < nums.length; i++) {
        if (nums[i] !== nums[slow]) {
            nums[++slow] = nums[i]
        }
    }

    console.log('result arr:', nums.slice(0, slow + 1))

    return slow + 1
};

console.log(removeDuplicates([1, 1, 2]))
console.log(removeDuplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4]))