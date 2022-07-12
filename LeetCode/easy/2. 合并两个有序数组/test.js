/**
 * 双指针+ 一个新指针（其实是三指针）
 * 倒序遍历
 * @param {array} nums1 
 * @param {array} nums2 
 */
function merge(nums1, nums2) {
    let m = nums1.length
    let n = nums2.length

    // l1 l2分别指向两个原始数组末尾
    let l1 = m - 1
    let l2 = n - 1

    // len 指向合并后的新nums1数组末尾
    let len = m + n - 1

    while (l2 >= 0) {
        if (l1 >= 0) {
            if (nums1[l1] > nums2[l2]) {
                nums1[len--] = nums1[l1--]
            } else {
                nums1[len--] = nums2[l2--]
            }
        } else {
            // 数组nums1已经遍历结束，只需要把nums2剩余的拷贝到nums1中就可以了
            nums1[len--] = nums2[l2--]
        }
    }
}

let nums1 = [1, 2, 3]
let nums2 = [0, 1, 2, 5, 6]

merge(nums1, nums2);

console.log('nums1:', nums1);
