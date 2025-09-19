var nums = [1, 7, 3, 6, 5, 6]

console.log(findMiddleIndex(nums))

function findMiddleIndex(nums) {
    if (!nums || nums.length === 0) return -1;

    let totalSum = nums.reduce((sum, num) => sum + num, 0)
    let leftSum = 0

    // leftSum + nums[i] + rightSum = totalSum
    // => leftSum = totalSum - leftSum - nums[i]
    // => leftSum * 2 = totalSum - nums[i]
    // => leftSum * 2 + nums[i] = totalSum
    for (let i = 0; i < nums.length; i++) {
        if (leftSum * 2 + nums[i] === totalSum) {
            return i
        }
        leftSum += nums[i]
    }

    return -1
}
