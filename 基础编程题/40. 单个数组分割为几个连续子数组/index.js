// [2, 10, 3, 4, 5, 11, 10, 11, 20]，将其排列成一个新数组
// 要求新数组形式如下，例如 [[2, 3, 4, 5], [10, 11], [20]]
// 相邻数字放置到同一个子数组中

var arr = [2, 10, 3, 4, 5, 11, 10, 11, 20]

/**
 * 
 * @param {array} nums 
 */
function splitArray(nums) {

    //去重
    nums = [...new Set(nums)];

    //排序
    nums = nums.sort((a, b) => a - b);

    console.log('nums:', nums);

    const res = [];
    // 遍历一遍，相邻元素求差值，大于1则是不连续
    let subArr = [nums[0]];

    for (let i = 1; i < nums.length; i++) {
        if (nums[i] - nums[i - 1] === 1) {
            subArr.push(nums[i]);
        } else {
            res.push(subArr);
            subArr = [nums[i]];
        }
    }

    //遍历结束记得把最新的子数组添加进去
    res.push(subArr);

    return res;
}

function splitArray2(arr) {

    arr.sort((a, b) => a - b)

    arr = [...new Set(arr)]

    const res = []
    let subArr = [arr[0]]
    let i

    for (i = 1; i < arr.length; i++) {
        if (arr[i] - arr[i - 1] === 1) {
            subArr.push(arr[i])
        } else {
            res.push(subArr)
            subArr = [arr[i]]
        }
    }

    res.push(subArr)

    return res;
}

console.log('array split 1:', splitArray(arr))

console.log('array split 2:', splitArray2(arr))
