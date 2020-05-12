// 给定 nums = [2, 7, 11, 15], target = 9

// 因为 nums[0] + nums[1] = 2 + 7 = 9
// 所以返回 [0, 1]

function twoSum(nums, target) {

    const map = new Map();

    for (let i = 0; i < nums.length; i++) {
        const k = target - nums[i];

        if(map.has(k)){
            return [map.get(k), i];
        }

        map.set(nums[i], i);
    }

    return [];
}

const nums = [2, 7, 11, 15];
const target = 90;

console.log('two sum:', twoSum(nums, target));