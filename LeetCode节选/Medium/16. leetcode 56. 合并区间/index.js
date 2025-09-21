
// 以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回 一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间 。

//  

// 示例 1：

// 输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
// 输出：[[1,6],[8,10],[15,18]]
// 解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].
// 示例 2：

// 输入：intervals = [[1,4],[4,5]]
// 输出：[[1,5]]
// 解释：区间 [1,4] 和 [4,5] 可被视为重叠区间。
//  

// 提示：

// 1 <= intervals.length <= 104
// intervals[i].length == 2
// 0 <= starti <= endi <= 104

// 来源：力扣（LeetCode）
// 链接：https://leetcode.cn/problems/merge-intervals
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

/**
 * 合并重叠区间 - 简单高效易懂版本
 * 
 * 算法思路：
 * 1. 首先按照区间的起始位置进行排序
 * 2. 遍历排序后的区间，判断当前区间是否与前一个区间重叠
 * 3. 如果重叠，则合并区间；如果不重叠，则添加到结果中
 * 
 * 时间复杂度：O(n log n) - 主要是排序的时间复杂度
 * 空间复杂度：O(1) - 除了结果数组外，只使用常数额外空间
 * 
 * @param {number[][]} intervals - 区间数组
 * @returns {number[][]} 合并后的区间数组
 */
function merge(intervals) {
    // 边界条件：空数组或只有一个区间
    if (!intervals || intervals.length <= 1) {
        return intervals;
    }
    
    // 步骤1：按照区间起始位置排序
    // 排序是关键，确保我们按顺序处理区间
    intervals.sort((a, b) => a[0] - b[0]);
    
    // 步骤2：初始化结果数组，将第一个区间加入
    const result = [intervals[0]];
    
    // 步骤3：遍历剩余区间，判断是否需要合并
    for (let i = 1; i < intervals.length; i++) {
        const currentInterval = intervals[i];
        const lastMergedInterval = result[result.length - 1];
        
        // 判断是否重叠：当前区间的起始位置 <= 上一个区间的结束位置
        if (currentInterval[0] <= lastMergedInterval[1]) {
            // 重叠：合并区间，更新结束位置为两者中的最大值
            lastMergedInterval[1] = Math.max(lastMergedInterval[1], currentInterval[1]);
        } else {
            // 不重叠：直接添加当前区间到结果中
            result.push(currentInterval);
        }
    }
    
    return result;
}

// ==================== 测试用例 ====================

console.log('=== LeetCode 56: 合并区间 测试 ===\n');

// 测试数据
const testCases = [
    {
        input: [[1,3],[2,6],[8,10],[15,18]],
        expected: [[1,6],[8,10],[15,18]],
        description: "示例1：基本重叠合并"
    },
    {
        input: [[1,4],[4,5]],
        expected: [[1,5]],
        description: "示例2：边界重叠合并"
    },
    {
        input: [[1,4],[0,4]],
        expected: [[0,4]],
        description: "完全包含的区间"
    },
    {
        input: [[1,4],[2,3]],
        expected: [[1,4]],
        description: "内部包含的区间"
    },
    {
        input: [[1,3],[2,6],[8,10],[15,18]],
        expected: [[1,6],[8,10],[15,18]],
        description: "多个区间混合"
    },
    {
        input: [[1,4],[0,0]],
        expected: [[0,0],[1,4]],
        description: "不重叠的区间"
    },
    {
        input: [[2,3],[4,5],[6,7],[8,9],[1,10]],
        expected: [[1,10]],
        description: "一个大区间包含所有小区间"
    },
    {
        input: [[1,1],[2,2],[3,3]],
        expected: [[1,1],[2,2],[3,3]],
        description: "单点区间不重叠"
    },
    {
        input: [[1,2],[2,3],[3,4]],
        expected: [[1,4]],
        description: "连续边界重叠"
    },
    {
        input: [[1,1]],
        expected: [[1,1]],
        description: "单个区间"
    },
    {
        input: [],
        expected: [],
        description: "空数组"
    }
];

// 运行测试
let passCount = 0;

testCases.forEach((testCase, index) => {
    try {
        const result = merge(testCase.input);
        const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
        
        console.log(`测试 ${index + 1}: ${testCase.description}`);
        console.log(`输入: ${JSON.stringify(testCase.input)}`);
        console.log(`期望: ${JSON.stringify(testCase.expected)}`);
        console.log(`结果: ${JSON.stringify(result)}`);
        console.log(`状态: ${passed ? '✅ 通过' : '❌ 失败'}\n`);
        
        if (passed) passCount++;
    } catch (error) {
        console.log(`测试 ${index + 1}: ❌ 错误 - ${error.message}\n`);
    }
});

console.log(`总体结果: ${passCount}/${testCases.length} 测试通过\n`);

// ==================== 性能测试 ====================

console.log('=== 性能测试 ===\n');

function performanceTest() {
    // 生成测试数据
    function generateTestData(size) {
        const intervals = [];
        for (let i = 0; i < size; i++) {
            const start = Math.floor(Math.random() * 1000);
            const end = start + Math.floor(Math.random() * 100);
            intervals.push([start, end]);
        }
        return intervals;
    }
    
    const testSizes = [100, 1000, 5000];
    
    testSizes.forEach(size => {
        const testData = generateTestData(size);
        
        const startTime = performance.now();
        
        // 运行多次取平均值
        const iterations = size <= 1000 ? 100 : 10;
        for (let i = 0; i < iterations; i++) {
            merge([...testData]); // 使用副本避免修改原数据
        }
        
        const endTime = performance.now();
        const avgTime = (endTime - startTime) / iterations;
        
        console.log(`数据规模 ${size}: 平均耗时 ${avgTime.toFixed(3)}ms`);
    });
}

performanceTest();

// ==================== 算法复杂度分析 ====================

console.log('\n=== 算法复杂度分析 ===');
console.log('时间复杂度: O(n log n) - 主要来自排序操作');
console.log('空间复杂度: O(1) - 除结果数组外，只使用常数额外空间');
console.log('最优情况: O(n log n) - 无论输入如何都需要排序');
console.log('最坏情况: O(n log n) - 排序复杂度占主导');
console.log('平均情况: O(n log n) - 稳定的时间复杂度');

// 导出函数供其他模块使用
module.exports = { merge };

/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function (intervals) {
    // 按照各个子区间的左边界排序，便于后续合并区间
    intervals.sort((a, b) => a[0] - b[0])

    // 两两比较是否有交叉
    let res = [intervals[0]]
    // 结果数组对应子区间的索引号
    let idx = 0

    for (let i = 1; i < intervals.length; i++) {
        // 相邻区间有交叉，直接更新设置当前结果数组子区间的有边界即可
        if (intervals[i][0] < res[idx][1]) {
            res[idx][1] = Math.max(intervals[i][1], res[idx][1])
        } else {
            // 没有交叉，则追加到结果数组中
            res[++idx] = intervals[i]
        }
    }

    return res

};

console.log(merge([[1, 3], [2, 6], [8, 10], [15, 18]]))