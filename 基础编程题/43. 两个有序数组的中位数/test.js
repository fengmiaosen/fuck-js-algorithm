
function findMidValue(nums1, nums2) {
    let nums = []

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
        nums.push(...nums2)
    }

    console.log('nums:', nums)
}

let nums1 = [1, 2, 5]
let nums2 = [3, 4, 6, 8]

console.log(findMidValue(nums1, nums2));
