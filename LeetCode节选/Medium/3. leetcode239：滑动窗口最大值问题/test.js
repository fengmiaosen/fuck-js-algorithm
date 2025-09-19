
function maxSlidingWindowBruteForce(nums, k) {
    if (k <= 0) {
        return []
    }
    if (k === 1) {
        return nums
    }
    if (k > nums.length) {
        return [Math.max(...nums)]
    }

    let res = []
    for (let i = 0; i <= nums.length - k; i++) {
        let max = nums[i]
        for (let j = i; j < i + k; j++) {
            max = Math.max(max, nums[j])
        }
        res.push(max)
    }
    return res
}

console.log(maxSlidingWindowBruteForce([1, 3, -1, -3, 5, 3, 6, 7], 3))
