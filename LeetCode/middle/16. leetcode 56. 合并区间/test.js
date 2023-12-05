
function mergeList(nums) {
    if (nums.length < 2) {
        return nums
    }

    let res = [nums[0]]
    let idx = 0

    for (let i = 1; i < nums.length; i++) {
        if (res[idx][1] > nums[i][0]) {
            res[idx][1] = Math.max(res[idx][1], nums[i][1])
        } else {
            res[++idx] = nums[i]
        }
    }

    return res
}

console.log(mergeList([[1, 3], [2, 6], [8, 10], [15, 18]]))
