// 给你两个有序整数数组 nums1 和 nums2，请你将 nums2 合并到 nums1 中，使 nums1 成为一个有序数组。
// 说明:
// 初始化 nums1 和 nums2 的元素数量分别为 m 和 n 。
// 你可以假设 nums1 有足够的空间（空间大小大于或等于 m + n）来保存 nums2 中的元素。

// 示例:
// 输入:
// nums1 = [1,2,3,0,0,0], m = 3
// nums2 = [2,5,6],       n = 3

// 输出: [1,2,2,3,5,6]

// [88] 合并两个有序数组
// https://leetcode-cn.com/problems/merge-sorted-array/description/

/**
 * 方法一：双指针、倒序遍历
 * @param {*} nums1 
 * @param {*} m 
 * @param {*} nums2 
 * @param {*} n 
 */
function merge(nums1, m, nums2, n) {
    let l1 = m - 1;
    let l2 = n - 1;
    let len = m + n - 1;

    //从后往前倒序遍历nums2
    while (l2 >= 0) {

        //nums1倒序遍历，注意判断边界
        if (l1 >= 0) {
            if (nums1[l1] > nums2[l2]) {
                nums1[len] = nums1[l1];
                len--;
                l1--;
            } else {
                nums1[len] = nums2[l2];
                len--;
                l2--;
            }
        } else {
            // nums1已全部遍历结束，这时候num2前面的未遍历元素肯定比nums1当前已遍历过的元素都小
            // 所以只需要把num2前面剩下的所有元素移动到nums1覆盖对应位置
            nums1[len--] = nums2[l2--];
        }

    }
}

let nums1 = [1, 2, 3]
let nums2 = [0, 1, 2, 5, 6]

merge(nums1, 3, nums2, 5);

console.log('nums1:', nums1);