// 输入 '1, 2, 3, 5, 7, 8, 10' 输出 '1~3, 5, 7~8, 10'


const nums1 = [1, 2, 3, 5, 7, 8, 10];

/**
 * 
 * @param {number[]} nums 
 */
function convert(nums) {

    let res = [];

    let tmp = nums[0];

    for (let i = 0; i < nums.length; i++) {
        //遍历到数组末尾项的时候，nums[i+1]为undefined
        // 所以要判断是否等于1，也包括前面的正常数值的差值
        if (nums[i + 1] - nums[i] != 1) {
            if (nums[i] !== tmp) {
                res.push(`${tmp}~${nums[i]}`);
            } else {
                res.push(tmp);
            }
            tmp = nums[i + 1];
        }
    }

    return res;
}

console.log('nums str:', convert(nums1));