
// 给你两个有序整数数组 nums1 和 nums2，请你将 nums2 合并到 nums1 中，使 nums1 成为一个有序数组。
// 说明:
// 初始化 nums1 和 nums2 的元素数量分别为 m 和 n 。
// 你可以假设 nums1 有足够的空间（空间大小大于或等于 m + n）来保存 nums2 中的元素。
// 链接：https://leetcode-cn.com/problems/merge-sorted-array

const nums1 = [1, 2, 3]
const nums2 = [2, 5, 6, 8]

// 双指针
function mergeList(arr1, arr2) {
    let m = arr1.length - 1;
    let n = arr2.length - 1;

    let len = arr1.length + arr2.length - 1;

    while (n >= 0) {
        if (m < 0) {
            arr1[len] = arr2[n]
            len--
            n--
        } else {
            if (arr1[m] > arr2[n]) {
                arr1[len] = arr1[m]
                len--
                m--
            } else {
                arr1[len] = arr2[n]
                len--
                n--
            }
        }

    }

}

mergeList(nums1, nums2);

console.log('merge list:', nums1);