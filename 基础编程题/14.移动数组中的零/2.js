// 将数组中的所有0移动到数组末尾，保持非零元素的相对顺序
// 要求在原数组上操作，不能拷贝新数组
// 尽量减少操作次数
// 输入 [0,1,0,3,13]
// 输出 [1,3,12,0,0]

// https://leetcode-cn.com/problems/move-zeroes/solution/shuang-zhi-zhen-jiao-huan-yuan-su-by-lo_e/
/**
 * 方法二：快慢双指针
 * 慢指针 之前的所有元素都是非零的。
 * 慢指针 和当前指针（快指针）之间的所有元素都是零
 * @param {array} nums 
 */
function moveZero(nums) {

    let i = 0; //快指针，用于遍历数组当前元素
    let j = 0; //慢指针，指向待交换元素

    while (i < nums.length) {
        if (nums[i] !== 0) {
            [nums[j], nums[i]] = [nums[i], nums[j]];
            j++;
        }
        i++;
    }

    return nums;
}

var arr = [8, 0, 1, 0, 3, 13, 0, 4];

console.log('new arr:', moveZero(arr));

