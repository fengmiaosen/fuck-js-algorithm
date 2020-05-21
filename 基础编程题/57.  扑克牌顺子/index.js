/**
 * @param {number[]} nums
 * @return {boolean}
 */
var isStraight = function (nums) {

    // 先排序，使得所有0位于数组前面
    nums.sort((a, b) => a - b);

    //记录0的数量
    let zeros = 0;

    for (let i = 0; i < nums.length - 1; i++) {
        if (nums[i] === 0) {
            zeros++;
        } else {
            //非0的相等元素，则肯定不为顺子
            if (nums[i] === nums[i + 1]) {
                return false;
            } else if (nums[i + 1] - nums[i] > 1) {
                //相邻元素差值大于1的是就用前面的 zero 来填充，相差1是不需要填充的，所以要多减去一个1
                zeros = zeros - (nums[i+1] - nums[i] - 1);

                if(zeros < 0){
                    return false;
                }
                continue;
            }
        }
    }
    return true;
};

var arr = [1,2,3,4,5];

console.log(isStraight(arr));