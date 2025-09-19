
// TODO
// 使用 Map 类型
// 时间复杂度：O(n)
// 空间复杂度：O(n)
function getIntersection(num1, num2) {
    const maps = {};
    const result = [];

    num1.forEach(num => {
        if (maps[num]) {
            maps[num] += 1;
        } else {
            maps[num] = 1;
        }
    });

    num2.forEach(num => {
        if (maps[num]) {
            result.push(num);
            maps[num] -= 1;
        }
    });
    return result;
}

var nums1 = [1, 2, 2, 1], nums2 = [2, 2, 3, 4];
console.log('nums1 nums2:', getIntersection(nums1, nums2))