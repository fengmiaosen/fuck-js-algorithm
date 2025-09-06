// 输入 '1, 2, 3, 5, 7, 8, 10' 输出 '1~3, 5, 7~8, 10'



/**
 * 
 * @param {number[]} nums 
 */
function convert(nums) {

    let res = [];
    let prev = nums[0];

    for (let i = 0; i < nums.length; i++) {
        // 遍历到数组末尾项的时候，nums[i+1]为undefined
        // 所以要判断是否等于1，也包括前面的正常数值的差值
        if (nums[i + 1] - nums[i] != 1) {
            if (nums[i] !== prev) {
                res.push(`${prev}~${nums[i]}`);
            } else {
                res.push(prev);
            }
            prev = nums[i + 1];
        }
    }

    return res;
}

function convert2(nums) {

    nums.sort((a, b) => a - b)

    nums = [...new Set(nums)]

    let res = []
    let tmp = nums[0]

    for (let i = 1; i < nums.length; i++) {
        if (nums[i] - nums[i - 1] > 1) {
            if (nums[i - 1] !== tmp) {
                res.push(`${tmp}~${nums[i - 1]}`)
            } else {
                res.push(tmp + '')
            }
            tmp = nums[i]
        }
    }

    res.push(tmp + '')

    return res
}

const nums1 = [1, 2, 3, 5, 7, 8, 10];

console.log('nums str:', convert(nums1));

console.log('nums str 2:', convert2(nums1));