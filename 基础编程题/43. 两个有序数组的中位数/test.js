
/**
 * 方法一：归并排序、有序数组合并、根据数组长度奇偶来分别计算中位数
 * 因为已经是有序数组，所以不需要递归调用来排序，只需要借鉴归并排序中两个有序数组合并的算法就可以
 * @param {*} nums1 
 * @param {*} nums2 
 */
function findMidValue(nums1, nums2) {

    let nums = [];

    // 合并有序数组
    while (nums1.length && nums2.length) {
        if (nums1[0] < nums2[0]) {
            nums.push(nums1.shift())
        } else {
            nums.push(nums2.shift())
        }
    }

    if (nums1.length) {
        nums.push(...nums1)
    }
    if (nums2.length) {
        nums.push(...nums2);
    }

    console.log('nums:', nums)

    let midValue = 0;

    return midValue;
}

var nums1 = [1, 2, 5]
var nums2 = [3, 4, 6, 8]

console.log(findMidValue(nums1, nums2));