let arr1 = [1, 2, 3, 4, 6, 9];
let arr2 = [3, 4, 7, 9];

/**
 * 方法一：使用数组的filter和includes方法
 * @param {*} nums1 
 * @param {*} nums2 
 */
function intersect(nums1, nums2) {

    return nums1.filter(n1 => nums2.includes(n1));
}

/**
 * 
 * @param {array} nums1 
 * @param {array} nums2 
 */
function intersect2(nums1, nums2) {
    let res = []
    let map = new Map()

    nums1.forEach(num => {
        map.set(num, 1)
    })

    nums2.forEach(num => {
        if (map.has(num)) {
            res.push(num)
        }
    })

    return res
}



console.log('arr intersect:', intersect(arr1, arr2));
console.log('arr intersect2:', intersect2(arr1, arr2));