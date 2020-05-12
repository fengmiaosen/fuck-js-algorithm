let arr = [1,2,3,4,5,6,7];


function rotate(nums, k) {
    
    nums.unshift(...nums.splice(-k));

    return nums;
}

console.log('array rotate:', rotate(arr, 3));