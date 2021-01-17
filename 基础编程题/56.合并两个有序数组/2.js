/**
 * 
 * @param {array} nums1 
 * @param {array} nums2 
 */
function mergeList(nums1, nums2) {
    let l1 = nums1.length - 1
    let l2 = nums2.length - 1
    let l = nums1.length + nums2.length - 1

    while (l2 >= 0) {
        if (l1 >= 0) {
            if (nums1[l1] > nums2[l2]) {
                nums1[l--] = nums1[l1--]
            } else {
                nums1[l--] = nums2[l2--]
            }
        } else {
            // nums1 原先元素已经拷贝完毕
            nums1[l--] = nums2[l2--]
        }
    }

}

const nums1 = [1, 2, 3, 9]
const nums2 = [2, 5, 6, 8]

mergeList(nums1, nums2);

console.log('merge list:', nums1);