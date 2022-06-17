// 给定一个数组，将数组中元素向右移动n个位置，n为非负数
// 输入 [1,2,3,4,5,6,7] n为3
// 输出 [5,6,7,1,2,3]


let arr = [1, 2, 3, 4, 5, 6, 7];


function rotate(nums, k) {

    nums.unshift(...nums.splice(-k))

    return nums;
}

console.log('array rotate:', rotate(arr, 3));