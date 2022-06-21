// 给你两个有序整数数组 nums1 和 nums2，请你将 nums2 合并到 nums1 中，使 nums1 成为一个有序数组。
// 说明:
// 初始化 nums1 和 nums2 的元素数量分别为 m 和 n 。
// 你可以假设 nums1 有足够的空间（空间大小大于或等于 m + n）来保存 nums2 中的元素。
// 链接：https://leetcode-cn.com/problems/merge-sorted-array


/**
 * 参考 https://github.com/sisterAn/JavaScript-Algorithms/issues/3
 * @param {*} nums1 
 * @param {*} m 
 * @param {*} nums2 
 * @param {*} n 
 */
function mergeList(nums1, m, nums2, n) {
    let l1 = m - 1;
    let l2 = n - 1;

    // 把 nums2 全部合并到 nums1 ，则合并后的 nums1 长度为 m+n
    let len = m + n - 1;

    while (l2 >= 0) {
        // 此时 nums1 已重写入， nums2 还未合并完，仅仅需要将 nums2 的剩余元素（0…len）写入 nums1 即可，写入后，合并完成
        if (l1 < 0) {
            nums1[len--] = nums2[l2--];
        } else {
            if (nums1[l1] > nums2[l2]) {
                nums1[len--] = nums1[l1--];
            } else {
                nums1[len--] = nums2[l2--];
            }
        }
    }
}

const nums1 = [1, 2, 3]
const nums2 = [2, 5, 6,8]

mergeList(nums1, nums1.length, nums2, nums2.length);

console.log('merge list:', nums1);