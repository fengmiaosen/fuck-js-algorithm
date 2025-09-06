// 给你两个有序整数数组 nums1 和 nums2，请你将 nums2 合并到 nums1 中，使 nums1 成为一个有序数组。
// 说明:
// 初始化 nums1 和 nums2 的元素数量分别为 m 和 n 。
// 你可以假设 nums1 有足够的空间（空间大小大于或等于 m + n）来保存 nums2 中的元素。
// 链接：https://leetcode-cn.com/problems/merge-sorted-array



function mergeList(nums1, m, nums2, n) {
    let i = m - 1;
    let j = n - 1;
    let k = m + n - 1;
    while (i >= 0 && j >= 0) {
        if (nums1[i] > nums2[j]) {
            nums1[k] = nums1[i];
            i--;
        } else {
            nums1[k] = nums2[j];
            j--;
        }
        k--;
    }
    while (j >= 0) {
        nums1[k] = nums2[j];
        j--;
        k--;
    }
    while (i >= 0) {
        nums1[k] = nums1[i];
        i--;
        k--;
    }

    return nums1;
}

// 时间复杂度：O(m+n)
// 空间复杂度：O(1)

function mergeList2(nums1, m, nums2, n) {
    let i = m - 1;
    let j = n - 1;
    let k = m + n - 1;

    // 从后往前比较，大的放到 nums1 的最后面
    // 先判断 2 个数组均未遍历结束情况
    while (i >= 0 && j >= 0) {
        if (nums1[i] > nums2[j]) {
            nums1[k--] = nums1[i--];
        } else {
            nums1[k--] = nums2[j--];
        }
    }

    // 比较完成后，如果 nums2 还有元素，直接放到 nums1 中
    while (j >= 0) {
        nums1[k--] = nums2[j--];
    }

    // 比较完成后，如果 nums1 还有元素，直接放到 nums1 中
    while (i >= 0) {
        nums1[k--] = nums1[i--];
    }

    return nums1;
}

const nums1 = [1, 2, 3]
const nums2 = [2, 5, 6, 8]

// mergeList(nums1, nums1.length, nums2, nums2.length);

// console.log('merge list1:', nums1);

mergeList2(nums1, nums1.length, nums2, nums2.length);

console.log('merge list2:', nums1);