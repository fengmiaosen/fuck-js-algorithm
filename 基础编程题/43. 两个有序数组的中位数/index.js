// 给定两个大小为 m 和 n 的有序数组 nums1 和 nums2。
// 请找出这两个有序数组的中位数。要求算法的时间复杂度为 O(log(m+n))。

// 示例 1：

// nums1 = [1, 3]
// nums2 = [2]
// 中位数是 2.0

// 示例 2：

// nums1 = [1, 2]
// nums2 = [3, 4]
// 中位数是(2 + 3) / 2 = 2.5

// 中位数被用来：
// 将一个集合划分为两个长度相等的子集，其中一个子集中的元素总是大于另一个子集中的元素。

/**
 * 方法一：归并排序、有序数组合并、根据数组长度奇偶来分别计算中位数
 * 因为已经是有序数组，所以不需要递归调用来排序，只需要借鉴归并排序中两个有序数组合并的算法就可以
 * @param {*} nums1 
 * @param {*} nums2 
 */
function findMidValue(nums1, nums2) {

    let nums = [];

    //合并两个有序数组
    while (nums1.length && nums2.length) {
        if (nums1[0] < nums2[0]) {
            nums.push(nums1.shift())
        } else {
            nums.push(nums2.shift());
        }
    }

    if (nums1.length) {
        nums.push(...nums1);
    }

    if (nums2.length) {
        nums.push(...nums2);
    }

    let len = nums.length;
    let midValue = 0;

    console.log('nums:', nums);

    if (len % 2 === 0) {
        midValue = (nums[len / 2] + nums[len / 2 - 1]) / 2;
    } else {
        midValue = nums[Math.floor(len / 2)];
    }


    return midValue;
}

var nums1 = [1, 2]
var nums2 = [3, 4, 6, 8]

console.log(findMidValue(nums1, nums2));