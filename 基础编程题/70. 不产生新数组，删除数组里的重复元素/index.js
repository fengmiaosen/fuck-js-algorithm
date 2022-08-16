// 如何在不产生性数组的情况下删除数组中的重复元素
/**
 * 
 * @param {array} nums 
 * @returns 
 */
const removeDuplicates = (nums) => {
    let len = nums.length - 1
    for (let i = len; i >= 0; i--) {
        if (nums.indexOf(nums[i]) != i) {
            nums[i] = nums[len--]
        }
    }
    // 删除重复项
    nums.splice(len + 1)

    return nums
}
// 测试
// [1, 2, 3]

console.log(removeDuplicates([1, 2, 3, 1, 3]))