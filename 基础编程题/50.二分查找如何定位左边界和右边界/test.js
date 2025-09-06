let arr = [1, 3, 4, 4, 6, 8, 10];

console.log('left bound:', findLeft(arr, 4))

console.log('right bound:', findRight(arr, 4))

function findLeft(nums, target) {
    let left = 0
    let right = nums.length - 1

    while (left <= right) {
        let midIndex = Math.floor((left + right) / 2)
        if (nums[midIndex] < target) {
            left = midIndex + 1
        } else if (nums[midIndex] > target) {
            right = midIndex - 1
        } else {
            right = midIndex - 1
        }
    }

    // 1. 数组越界
    // 2. 数组元素不等于target
    if (left >= nums.length || nums[left] !== target) {
        return -1
    }
    return left
}

function findRight(nums, target) {
    let left = 0
    let right = nums.length - 1

    while (left <= right) {
        let midIndex = Math.floor((left + right) / 2)
        if (nums[midIndex] <= target) {
            left = midIndex + 1
        } else {
            right = midIndex - 1
        }
    }

    // 1. 数组越界
    // 2. 数组元素不等于target
    if (right < 0 || nums[right] !== target) {
        return -1
    }

    return right
}