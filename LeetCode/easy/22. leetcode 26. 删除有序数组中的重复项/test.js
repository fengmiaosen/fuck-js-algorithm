function removeDuplicates(nums) {

    let slow = 0
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] !== nums[slow]) {
            nums[++slow] = nums[i]
        }
    }

    console.log('array:', nums)
    return slow
}

console.log(removeDuplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4]))
