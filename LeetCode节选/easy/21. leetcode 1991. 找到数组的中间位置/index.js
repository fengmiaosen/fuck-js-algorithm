// https://leetcode.cn/problems/find-the-middle-index-in-array/

// // https://leetcode.cn/leetbook/read/array-and-string/yf47s/
// // 寻找数组的中心索引
// // 与本题目等同

// 给你一个整数数组 nums ，请计算数组的 中心下标 。

// 数组 中心下标 是数组的一个下标，其左侧所有元素相加的和等于右侧所有元素相加的和。

// 如果中心下标位于数组最左端，那么左侧数之和视为 0 ，因为在下标的左侧不存在元素。这一点对于中心下标位于数组最右端同样适用。

// 如果数组有多个中心下标，应该返回 最靠近左边 的那一个。如果数组不存在中心下标，返回 -1 。

//  

// 示例 1：

// 输入：nums = [1, 7, 3, 6, 5, 6]
// 输出：3
// 解释：
// 中心下标是 3 。
// 左侧数之和 sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11 ，
// 右侧数之和 sum = nums[4] + nums[5] = 5 + 6 = 11 ，二者相等。
// 示例 2：

// 输入：nums = [1, 2, 3]
// 输出：-1
// 解释：
// 数组中不存在满足此条件的中心下标。

// 作者：力扣 (LeetCode)
// 链接：https://leetcode.cn/leetbook/read/array-and-string/yf47s/
// 来源：力扣（LeetCode）
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

/**
 * 解法1：暴力解法 - 对每个位置计算左右两侧元素和
 * 时间复杂度：O(n²)
 * 空间复杂度：O(1)
 * @param {number[]} nums
 * @return {number}
 */
function findMiddleIndexBruteForce(nums) {
    if (!nums || nums.length === 0) return -1;
    
    const n = nums.length;
    
    for (let i = 0; i < n; i++) {
        let leftSum = 0;
        let rightSum = 0;
        
        // 计算左侧元素和
        for (let j = 0; j < i; j++) {
            leftSum += nums[j];
        }
        
        // 计算右侧元素和
        for (let k = i + 1; k < n; k++) {
            rightSum += nums[k];
        }
        
        // 如果左右两侧和相等，返回当前索引
        if (leftSum === rightSum) {
            return i;
        }
    }
    
    return -1;
}

/**
 * 解法2：前缀和优化解法 - 使用前缀和数组减少重复计算
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)
 * @param {number[]} nums
 * @return {number}
 */
function findMiddleIndexPrefixSum(nums) {
    if (!nums || nums.length === 0) return -1;
    
    const n = nums.length;
    const prefixSum = new Array(n + 1).fill(0);
    
    // 构建前缀和数组
    for (let i = 0; i < n; i++) {
        prefixSum[i + 1] = prefixSum[i] + nums[i];
    }
    
    // 查找中心索引
    for (let i = 0; i < n; i++) {
        const leftSum = prefixSum[i];
        const rightSum = prefixSum[n] - prefixSum[i + 1];
        
        if (leftSum === rightSum) {
            return i;
        }
    }
    
    return -1;
}

/**
 * 解法3：一次遍历解法 - 利用总和与左侧和的关系（最优解）
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 * @param {number[]} nums
 * @return {number}
 */
function findMiddleIndexOptimal(nums) {
    if (!nums || nums.length === 0) return -1;
    
    // 计算数组总和
    const totalSum = nums.reduce((sum, num) => sum + num, 0);
    let leftSum = 0;
    
    // 遍历数组，利用 leftSum * 2 + nums[i] === totalSum 的关系
    for (let i = 0; i < nums.length; i++) {
        // 如果左侧和的两倍加上当前元素等于总和，说明找到了中心索引
        if (leftSum * 2 + nums[i] === totalSum) {
            return i;
        }
        leftSum += nums[i];
    }
    
    return -1;
}

/**
 * 解法4：数学优化解法 - 基于数学关系的简化版本
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 * @param {number[]} nums
 * @return {number}
 */
function findMiddleIndexMath(nums) {
    if (!nums || nums.length === 0) return -1;
    
    const totalSum = nums.reduce((sum, num) => sum + num, 0);
    let leftSum = 0;
    
    for (let i = 0; i < nums.length; i++) {
        // 右侧和 = 总和 - 左侧和 - 当前元素
        const rightSum = totalSum - leftSum - nums[i];
        
        if (leftSum === rightSum) {
            return i;
        }
        
        leftSum += nums[i];
    }
    
    return -1;
}

// 测试用例
const testCases = [
    [1, 7, 3, 6, 5, 6],  // 期望输出: 3
    [1, 2, 3],           // 期望输出: -1
    [2, 1, -1],          // 期望输出: 0
    [1],                 // 期望输出: 0
    [],                  // 期望输出: -1
    [0, 0, 0],           // 期望输出: 0, 1, 2 (返回最左边的)
    [-1, -1, -1, 0, 1, 1], // 期望输出: 0
    [1, 0, 1],           // 期望输出: 1
    [0],                 // 期望输出: 0
    [1, 2, 3, 4, 5, 6]   // 期望输出: -1
];

console.log('=== 暴力解法测试 ===');
testCases.forEach((test, index) => {
    const result = findMiddleIndexBruteForce(test);
    console.log(`测试${index + 1}: [${test.join(', ')}] => ${result}`);
});

console.log('\n=== 前缀和解法测试 ===');
testCases.forEach((test, index) => {
    const result = findMiddleIndexPrefixSum(test);
    console.log(`测试${index + 1}: [${test.join(', ')}] => ${result}`);
});

console.log('\n=== 一次遍历最优解法测试 ===');
testCases.forEach((test, index) => {
    const result = findMiddleIndexOptimal(test);
    console.log(`测试${index + 1}: [${test.join(', ')}] => ${result}`);
});

console.log('\n=== 数学优化解法测试 ===');
testCases.forEach((test, index) => {
    const result = findMiddleIndexMath(test);
    console.log(`测试${index + 1}: [${test.join(', ')}] => ${result}`);
});

// 边界情况详细测试
console.log('\n=== 边界情况详细测试 ===');

// 测试单元素数组
console.log('单元素数组测试:');
console.log(`[5] => ${findMiddleIndexOptimal([5])}`); // 应该返回 0

// 测试所有元素为0的数组
console.log('全零数组测试:');
console.log(`[0, 0, 0, 0] => ${findMiddleIndexOptimal([0, 0, 0, 0])}`); // 应该返回 0

// 测试负数数组
console.log('负数数组测试:');
console.log(`[-1, -1, 0, 1, 1] => ${findMiddleIndexOptimal([-1, -1, 0, 1, 1])}`); // 应该返回 2

// 测试大数组
console.log('大数组测试:');
const largeArray = new Array(1000).fill(1);
largeArray[500] = -998; // 使得索引500成为中心索引
console.log(`大数组(1000个元素) => ${findMiddleIndexOptimal(largeArray)}`);

// 性能测试
function performanceTest() {
    const largeTestArray = new Array(10000).fill(1);
    largeTestArray[5000] = -9999; // 设置中心索引
    const iterations = 1000;
    
    console.log('\n=== 性能测试 ===');
    
    // 测试暴力解法（小数组）
    const smallArray = new Array(100).fill(1);
    smallArray[50] = -99;
    
    console.time('暴力解法(100元素)');
    for (let i = 0; i < iterations; i++) {
        findMiddleIndexBruteForce(smallArray);
    }
    console.timeEnd('暴力解法(100元素)');
    
    // 测试前缀和解法
    console.time('前缀和解法(10000元素)');
    for (let i = 0; i < iterations; i++) {
        findMiddleIndexPrefixSum(largeTestArray);
    }
    console.timeEnd('前缀和解法(10000元素)');
    
    // 测试一次遍历解法
    console.time('一次遍历解法(10000元素)');
    for (let i = 0; i < iterations; i++) {
        findMiddleIndexOptimal(largeTestArray);
    }
    console.timeEnd('一次遍历解法(10000元素)');
    
    // 测试数学优化解法
    console.time('数学优化解法(10000元素)');
    for (let i = 0; i < iterations; i++) {
        findMiddleIndexMath(largeTestArray);
    }
    console.timeEnd('数学优化解法(10000元素)');
}

performanceTest();

// 算法正确性验证
function validateAlgorithms() {
    console.log('\n=== 算法正确性验证 ===');
    
    let allPassed = true;
    
    testCases.forEach((test, index) => {
        const result1 = findMiddleIndexBruteForce(test);
        const result2 = findMiddleIndexPrefixSum(test);
        const result3 = findMiddleIndexOptimal(test);
        const result4 = findMiddleIndexMath(test);
        
        const allEqual = result1 === result2 && result2 === result3 && result3 === result4;
        
        if (!allEqual) {
            console.log(`❌ 测试${index + 1}失败: [${test.join(', ')}]`);
            console.log(`  暴力解法: ${result1}, 前缀和: ${result2}, 一次遍历: ${result3}, 数学优化: ${result4}`);
            allPassed = false;
        } else {
            console.log(`✅ 测试${index + 1}通过: [${test.join(', ')}] => ${result1}`);
        }
    });
    
    console.log(`\n总体结果: ${allPassed ? '✅ 所有算法结果一致' : '❌ 存在算法结果不一致'}`);
}

validateAlgorithms();

// 导出函数（如果在模块环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        findMiddleIndexBruteForce,
        findMiddleIndexPrefixSum,
        findMiddleIndexOptimal,
        findMiddleIndexMath
    };
}

