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



console.log('arr intersect:', intersect(arr1, arr2));