// 给定两个数组 nums1 和 nums2 ，返回 它们的交集 。输出结果中的每个元素一定是 唯一 的。我们可以 不考虑输出结果的顺序 。

//  

// 示例 1：

// 输入：nums1 = [1,2,2,1], nums2 = [2,2]
// 输出：[2]
// 示例 2：

// 输入：nums1 = [4,9,5], nums2 = [9,4,9,8,4]
// 输出：[9,4]
// 解释：[4,9] 也是可通过的

// 来源：力扣（LeetCode）
// 链接：https://leetcode.cn/problems/intersection-of-two-arrays
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

/**
 * 
 * @param {array} arr1 
 * @param {array} arr2 
 */
function getIntersection(arr1, arr2) {
    let map = new Map()

    arr1.forEach(num => {
        if (map.has(num)) {
            map.set(num, map.get(num) + 1)
        } else {
            map.set(num, 1)
        }
    })

    let res = new Set()
    arr2.forEach(num => {
        if (map.has(num)) {
            res.add(num)
        }
    })

    return [...res]
}

let nums1 = [4, 9, 5], nums2 = [9, 4, 9, 8, 4]

console.log(getIntersection(nums1, nums2))