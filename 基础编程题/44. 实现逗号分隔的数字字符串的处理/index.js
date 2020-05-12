
// 输入 '1, 2, 3, 5, 7, 8, 10' 输出 '1~3, 5, 7~8, 10'

var str = '1,2,3,5,7,8,10,20,30,31';

function func(str) {

    let nums = str.split(',');

    let res = [];
    let subArr = [nums[0]];

    //慢指针指向连续数组的左边界
    let j = 0;

    // 快指针，指向当前元素
    let i = 1;

    for (; i < nums.length; i++) {
        // 遇到不连续的两个元素，则截取快慢指针之间的数组元素，并改变慢指针的指向
        if (nums[i] - nums[i - 1] > 1) {
            subArr = nums.slice(j, i);

            res.push(convertStr(subArr));

            j = i;
        }
    }

    // 遍历结束后，记得要获取慢指针到数组末尾之间的元素
    subArr = nums.slice(j);

    res.push(convertStr(subArr));

    return res.join(',');

}

function convertStr(list) {
    // 处理连续数组的输出格式
    // 以波浪线间隔
    let newStr = '';

    if (list.length === 1) {
        newStr = list[0].toString();
    } else if (list.length > 1) {
        newStr = `${list[0]}~${list[list.length - 1]}`
    }

    return newStr;
}

console.log('new str:', func(str));