// 不使用JS数组API，查找有序数列最先出现的位置和最后出现的位置

/**
 * 寻找目标值左侧边界
 * @param {*} nums 
 * @param {*} target 
 */
function findLeft(nums, target) {

    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {

        let mid = Math.floor((left + right) / 2);

        if (nums[mid] === target) {
            right = mid - 1; //关键地方
        } else if (nums[mid] > target) {
            right = mid - 1; //关键地方
        } else {
            left = mid + 1;
        }
    }


    // 1. 数组越界
    // 2. 数组元素不等于target
    if (left >= nums.length || nums[left] !== target) {
        return -1
    }

    return left;
}

/**
 * 寻找目标值右侧边界
 * @param {*} nums 
 * @param {*} target 
 */
function findRight(nums, target) {

    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {

        let mid = Math.floor((left + right) / 2);

        if (nums[mid] === target) {
            left = mid + 1 //关键地方
        } else if (nums[mid] > target) {
            right = mid - 1;
        } else {
            left = mid + 1;//关键地方
        }
    }

    // 1. 数组越界
    // 2. 数组元素不等于target
    if (right < 0 || nums[right] !== target) {
        return -1
    }
    
    return right;
}

let arr = [1, 3, 4, 4, 6, 8, 10];

console.log('left bound:', findLeft(arr, 4))

console.log('right bound:', findRight(arr, 4))