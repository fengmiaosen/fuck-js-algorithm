
function mergeList(nums1, nums2) {
    let l1 = nums1.length - 1
    let l2 = nums2.length - 1
    let len = nums1.length + nums2.length - 1

    while (l2 >= 0) {
        if (l1 >= 0) {
            if (nums1[l1] > nums2[l2]) {
                nums1[len] = nums1[l1]
                len--
                l1--
            } else {
                nums1[len] = nums2[l2]
                len--
                l2--
            }
        } else {
            nums1[len] = nums2[l2]
            len--
            l2--
        }
    }
}

const nums1 = [1, 2, 3]
const nums2 = [2, 5, 6, 8]


mergeList(nums1, nums2);

console.log('merge list:', nums1);