// 给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。

// 你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。

// 示例:
// 给定 nums = [2, 7, 11, 15], target = 9
// 因为 nums[0] + nums[1] = 2 + 7 = 9
// 所以返回 [0, 1]

// 来源：力扣（LeetCode）
// 链接：https://leetcode-cn.com/problems/two-sum

function twoSum(nums, target) {
    let map = new Map();
    let res = [];

    // 除了抛出异常以外，没有办法中止或跳出 forEach() 循环
    nums.forEach((v, idx) => {
        const k = target - v;

        if (map.has(k)) {
            res = [map.get(k), idx];
        } else {
            map.set(v, idx);
        }
    });

    return res;
}

console.log(twoSum([2, 7, 11, 15], 18));