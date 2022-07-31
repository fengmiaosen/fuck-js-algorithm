// https://github.com/sisterAn/JavaScript-Algorithms/issues/135

const removeDuplicates = (nums) => {
    let len = nums.length - 1
    for (let i = len; i >= 0; i--) {
        if (nums.indexOf(nums[i]) != i) {
            nums[i] = nums[len--]
        }
    }
    // 删除重复项
    nums.splice(len + 1)
    return nums
}

function setArr(arr, map = new Map()) {
    let idx = arr.length - 1;
    
    while (idx >= 0) {
        if (map.get(arr[idx])) {
            arr.splice(idx, 1)
        } else {
            map.set(arr[idx], true)
        }
        idx--;
    }
    return arr
}

// 测试
console.log(removeDuplicates([1, 2, 3, 1, 3]))
console.log(setArr([1, 2, 3, 1, 3]))