// [2, 10, 3, 4, 5, 11, 10, 11, 20]，将其排列成一个新数组
// 要求新数组形式如下，例如 [[2, 3, 4, 5], [10, 11], [20]]
// 相邻数字放置到同一个子数组中

var arr = [2, 10, 3, 4, 5, 11, 10, 11, 20]

/**
 * 将数组分割成多个连续子数组
 * 
 * 算法思路：
 * 1. 先去重，避免重复数字影响连续性判断
 * 2. 对数组进行排序，使相邻的数字在物理位置上也相邻
 * 3. 遍历排序后的数组，判断相邻元素差值是否为1
 * 4. 如果差值为1，说明连续，加入当前子数组
 * 5. 如果差值不为1，说明不连续，开始新的子数组
 * 
 * 时间复杂度：O(n log n) - 主要由排序决定
 * 空间复杂度：O(n) - 需要额外空间存储结果
 * 
 * @param {number[]} nums - 输入的数字数组
 * @returns {number[][]} - 返回分割后的二维数组，每个子数组包含连续的数字
 * 
 * 示例：
 * splitArray([2, 10, 3, 4, 5, 11, 10, 11, 20])
 * 返回：[[2, 3, 4, 5], [10, 11], [20]]
 */
function splitArray(nums) {
    // 边界条件检查
    if (!Array.isArray(nums) || nums.length === 0) {
        return [];
    }
    
    // 第一步：去重，使用Set去除重复元素
    nums = [...new Set(nums)];

    // 第二步：排序，从小到大排列
    nums = nums.sort((a, b) => a - b);

    const res = []; // 存储最终结果的数组
    
    // 初始化第一个子数组，包含第一个元素
    let subArr = [nums[0]];

    // 第三步：遍历数组，从第二个元素开始
    for (let i = 1; i < nums.length; i++) {
        // 判断当前元素与前一个元素的差值是否为1（连续）
        if (nums[i] - nums[i - 1] === 1) {
            // 连续，加入当前子数组
            subArr.push(nums[i]);
        } else {
            // 不连续，将当前子数组加入结果，开始新的子数组
            res.push(subArr);
            subArr = [nums[i]];
        }
    }

    // 第四步：遍历结束后，将最后一个子数组加入结果
    res.push(subArr);

    return res;
}

/**
 * 将数组分割成多个连续子数组（优化版本）
 * 
 * 相比splitArray，增加了更多的边界条件处理和错误检查
 * 
 * @param {number[]} arr - 输入的数字数组
 * @returns {number[][]} - 返回分割后的二维数组
 */
function splitArrayOptimized(arr) {
    // 参数验证
    if (!Array.isArray(arr)) {
        throw new TypeError('参数必须是数组');
    }
    
    if (arr.length === 0) {
        return [];
    }
    
    // 过滤非数字元素
    const validNumbers = arr.filter(item => typeof item === 'number' && !isNaN(item));
    
    if (validNumbers.length === 0) {
        return [];
    }
    
    // 排序：从小到大
    validNumbers.sort((a, b) => a - b);

    // 去重：使用Set去除重复元素
    const uniqueNumbers = [...new Set(validNumbers)];

    const result = []; // 结果数组
    let currentSubArray = [uniqueNumbers[0]]; // 当前子数组，初始包含第一个元素

    // 遍历数组，从第二个元素开始
    for (let i = 1; i < uniqueNumbers.length; i++) {
        if (uniqueNumbers[i] - uniqueNumbers[i - 1] === 1) {
            // 连续数字，加入当前子数组
            currentSubArray.push(uniqueNumbers[i]);
        } else {
            // 不连续，保存当前子数组，开始新的子数组
            result.push(currentSubArray);
            currentSubArray = [uniqueNumbers[i]];
        }
    }

    // 添加最后一个子数组
    result.push(currentSubArray);

    return result;
}

/**
 * 使用Map优化的版本（适用于大数据量）
 * 
 * 当数组很大时，可以使用Map来优化性能
 * 
 * @param {number[]} arr - 输入的数字数组
 * @returns {number[][]} - 返回分割后的二维数组
 */
function splitArrayWithMap(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
        return [];
    }
    
    // 使用Map去重并排序
    const uniqueSet = new Set(arr.filter(item => typeof item === 'number' && !isNaN(item)));
    const sortedArray = Array.from(uniqueSet).sort((a, b) => a - b);
    
    if (sortedArray.length === 0) {
        return [];
    }
    
    const result = [];
    let currentGroup = [sortedArray[0]];
    
    for (let i = 1; i < sortedArray.length; i++) {
        if (sortedArray[i] === sortedArray[i - 1] + 1) {
            currentGroup.push(sortedArray[i]);
        } else {
            result.push(currentGroup);
            currentGroup = [sortedArray[i]];
        }
    }
    
    result.push(currentGroup);
    return result;
}

// 测试用例
console.log('原始数组:', arr);
console.log('基础版本结果:', splitArray(arr));
console.log('优化版本结果:', splitArrayOptimized(arr));
console.log('Map版本结果:', splitArrayWithMap(arr));

// 边界测试
console.log('\n=== 边界测试 ===');
console.log('空数组:', splitArrayOptimized([]));
console.log('单个元素:', splitArrayOptimized([5]));
console.log('重复元素:', splitArrayOptimized([1, 1, 2, 2, 3, 3]));
console.log('非连续:', splitArrayOptimized([1, 3, 5, 7, 9]));
console.log('全连续:', splitArrayOptimized([1, 2, 3, 4, 5]));

// 预期输出：
// 基础版本结果: [[2, 3, 4, 5], [10, 11], [20]]
// 优化版本结果: [[2, 3, 4, 5], [10, 11], [20]]
// Map版本结果: [[2, 3, 4, 5], [10, 11], [20]]