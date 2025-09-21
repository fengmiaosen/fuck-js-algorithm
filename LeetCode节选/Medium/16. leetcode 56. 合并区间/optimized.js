/**
 * LeetCode 56: 合并区间 - 多种优化解法
 * 
 * 题目：给定一个区间的集合，请合并所有重叠的区间
 * 
 * 核心思想：
 * 1. 排序是关键 - 按起始位置排序后，只需要考虑相邻区间的合并
 * 2. 贪心策略 - 每次都尽可能地扩展当前区间
 * 3. 一次遍历 - 排序后只需要一次遍历即可完成合并
 */

// ==================== 方法1: 标准解法 (推荐) ====================

/**
 * 方法1: 标准排序+合并解法
 * 时间复杂度: O(n log n) - 排序占主导
 * 空间复杂度: O(1) - 除结果数组外，只使用常数空间
 * 
 * 核心思想：
 * 1. 按起始位置排序，确保处理顺序
 * 2. 遍历区间，判断是否与前一个区间重叠
 * 3. 重叠则合并，不重叠则添加新区间
 * 
 * 优势：
 * - 逻辑清晰，易于理解
 * - 空间效率高
 * - 代码简洁
 * 
 * @param {number[][]} intervals - 区间数组
 * @returns {number[][]} 合并后的区间数组
 */
function mergeStandard(intervals) {
    if (!intervals || intervals.length <= 1) {
        return intervals;
    }
    
    // 按起始位置排序
    intervals.sort((a, b) => a[0] - b[0]);
    
    const result = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const last = result[result.length - 1];
        
        // 判断重叠：当前起始 <= 上一个结束
        if (current[0] <= last[1]) {
            // 合并：更新结束位置
            last[1] = Math.max(last[1], current[1]);
        } else {
            // 不重叠：添加新区间
            result.push(current);
        }
    }
    
    return result;
}

// ==================== 方法2: 函数式编程风格 ====================

/**
 * 方法2: 函数式编程风格
 * 时间复杂度: O(n log n)
 * 空间复杂度: O(n) - reduce过程中的累积数组
 * 
 * 核心思想：
 * 使用reduce函数进行累积合并，代码更加函数式
 * 
 * 优势：
 * - 函数式编程风格
 * - 代码简洁优雅
 * - 易于链式调用
 * 
 * @param {number[][]} intervals
 * @returns {number[][]}
 */
function mergeFunctional(intervals) {
    if (!intervals || intervals.length <= 1) {
        return intervals;
    }
    
    return intervals
        .sort((a, b) => a[0] - b[0])
        .reduce((merged, current) => {
            const last = merged[merged.length - 1];
            
            if (merged.length === 0 || current[0] > last[1]) {
                // 不重叠：添加新区间
                merged.push(current);
            } else {
                // 重叠：合并区间
                last[1] = Math.max(last[1], current[1]);
            }
            
            return merged;
        }, []);
}

// ==================== 方法3: 原地修改优化 ====================

/**
 * 方法3: 原地修改优化版本
 * 时间复杂度: O(n log n)
 * 空间复杂度: O(1) - 原地修改，不使用额外空间
 * 
 * 核心思想：
 * 在原数组上进行修改，减少空间使用
 * 
 * 优势：
 * - 空间效率最高
 * - 适合内存敏感场景
 * 
 * 注意：会修改原数组
 * 
 * @param {number[][]} intervals
 * @returns {number[][]}
 */
function mergeInPlace(intervals) {
    if (!intervals || intervals.length <= 1) {
        return intervals;
    }
    
    // 排序
    intervals.sort((a, b) => a[0] - b[0]);
    
    let writeIndex = 0; // 写入位置
    
    for (let readIndex = 1; readIndex < intervals.length; readIndex++) {
        const current = intervals[readIndex];
        const last = intervals[writeIndex];
        
        if (current[0] <= last[1]) {
            // 重叠：合并到writeIndex位置
            last[1] = Math.max(last[1], current[1]);
        } else {
            // 不重叠：移动到下一个写入位置
            writeIndex++;
            intervals[writeIndex] = current;
        }
    }
    
    // 截取有效部分
    return intervals.slice(0, writeIndex + 1);
}

// ==================== 方法4: 栈解法 ====================

/**
 * 方法4: 使用栈的解法
 * 时间复杂度: O(n log n)
 * 空间复杂度: O(n) - 栈空间
 * 
 * 核心思想：
 * 使用栈来维护已合并的区间，更直观地表达合并过程
 * 
 * 优势：
 * - 思路直观
 * - 易于扩展到其他栈相关问题
 * 
 * @param {number[][]} intervals
 * @returns {number[][]}
 */
function mergeWithStack(intervals) {
    if (!intervals || intervals.length <= 1) {
        return intervals;
    }
    
    intervals.sort((a, b) => a[0] - b[0]);
    
    const stack = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const top = stack[stack.length - 1];
        
        if (current[0] <= top[1]) {
            // 重叠：合并栈顶元素
            top[1] = Math.max(top[1], current[1]);
        } else {
            // 不重叠：压入栈
            stack.push(current);
        }
    }
    
    return stack;
}

// ==================== 方法5: 区间树解法 (高级) ====================

/**
 * 方法5: 区间树解法 (适合频繁查询和插入的场景)
 * 时间复杂度: O(n log n) - 构建 + O(log n) - 查询
 * 空间复杂度: O(n)
 * 
 * 核心思想：
 * 构建区间树，支持高效的区间查询和合并
 * 适合需要频繁进行区间操作的场景
 * 
 * @param {number[][]} intervals
 * @returns {number[][]}
 */
function mergeWithIntervalTree(intervals) {
    if (!intervals || intervals.length <= 1) {
        return intervals;
    }
    
    // 简化版区间树实现
    class IntervalNode {
        constructor(start, end) {
            this.start = start;
            this.end = end;
            this.max = end; // 子树中的最大结束位置
            this.left = null;
            this.right = null;
        }
    }
    
    class IntervalTree {
        constructor() {
            this.root = null;
        }
        
        insert(start, end) {
            this.root = this._insert(this.root, start, end);
        }
        
        _insert(node, start, end) {
            if (!node) {
                return new IntervalNode(start, end);
            }
            
            if (start < node.start) {
                node.left = this._insert(node.left, start, end);
            } else {
                node.right = this._insert(node.right, start, end);
            }
            
            // 更新最大值
            node.max = Math.max(node.end, 
                node.left ? node.left.max : 0,
                node.right ? node.right.max : 0);
            
            return node;
        }
        
        getMergedIntervals() {
            const result = [];
            this._inorder(this.root, result);
            return this._mergeOverlapping(result);
        }
        
        _inorder(node, result) {
            if (!node) return;
            
            this._inorder(node.left, result);
            result.push([node.start, node.end]);
            this._inorder(node.right, result);
        }
        
        _mergeOverlapping(intervals) {
            if (intervals.length <= 1) return intervals;
            
            intervals.sort((a, b) => a[0] - b[0]);
            const result = [intervals[0]];
            
            for (let i = 1; i < intervals.length; i++) {
                const current = intervals[i];
                const last = result[result.length - 1];
                
                if (current[0] <= last[1]) {
                    last[1] = Math.max(last[1], current[1]);
                } else {
                    result.push(current);
                }
            }
            
            return result;
        }
    }
    
    const tree = new IntervalTree();
    intervals.forEach(([start, end]) => tree.insert(start, end));
    return tree.getMergedIntervals();
}

// ==================== 方法6: 分治法 ====================

/**
 * 方法6: 分治法解决
 * 时间复杂度: O(n log n)
 * 空间复杂度: O(log n) - 递归栈空间
 * 
 * 核心思想：
 * 将问题分解为子问题，分别解决后合并结果
 * 
 * @param {number[][]} intervals
 * @returns {number[][]}
 */
function mergeDivideConquer(intervals) {
    if (!intervals || intervals.length <= 1) {
        return intervals;
    }
    
    intervals.sort((a, b) => a[0] - b[0]);
    
    function divideAndMerge(start, end) {
        if (start >= end) {
            return [intervals[start]];
        }
        
        const mid = Math.floor((start + end) / 2);
        const left = divideAndMerge(start, mid);
        const right = divideAndMerge(mid + 1, end);
        
        return mergeTwoSortedIntervals(left, right);
    }
    
    function mergeTwoSortedIntervals(left, right) {
        const result = [];
        let i = 0, j = 0;
        
        while (i < left.length && j < right.length) {
            if (left[i][0] <= right[j][0]) {
                addInterval(result, left[i]);
                i++;
            } else {
                addInterval(result, right[j]);
                j++;
            }
        }
        
        while (i < left.length) {
            addInterval(result, left[i]);
            i++;
        }
        
        while (j < right.length) {
            addInterval(result, right[j]);
            j++;
        }
        
        return result;
    }
    
    function addInterval(result, interval) {
        if (result.length === 0 || result[result.length - 1][1] < interval[0]) {
            result.push(interval);
        } else {
            result[result.length - 1][1] = Math.max(result[result.length - 1][1], interval[1]);
        }
    }
    
    return divideAndMerge(0, intervals.length - 1);
}

// ==================== 测试用例 ====================

console.log('=== 合并区间 - 多种解法测试 ===\n');

// 测试数据
const testCases = [
    {
        input: [[1,3],[2,6],[8,10],[15,18]],
        expected: [[1,6],[8,10],[15,18]],
        description: "基本重叠合并"
    },
    {
        input: [[1,4],[4,5]],
        expected: [[1,5]],
        description: "边界重叠合并"
    },
    {
        input: [[1,4],[0,4]],
        expected: [[0,4]],
        description: "完全包含"
    },
    {
        input: [[2,3],[4,5],[6,7],[8,9],[1,10]],
        expected: [[1,10]],
        description: "大区间包含所有小区间"
    },
    {
        input: [[1,4],[0,0]],
        expected: [[0,0],[1,4]],
        description: "不重叠区间"
    }
];

// 所有解法
const methods = [
    { name: "标准解法", func: mergeStandard },
    { name: "函数式风格", func: mergeFunctional },
    { name: "原地修改", func: mergeInPlace },
    { name: "栈解法", func: mergeWithStack },
    { name: "区间树解法", func: mergeWithIntervalTree },
    { name: "分治法", func: mergeDivideConquer }
];

// 运行功能测试
methods.forEach(method => {
    console.log(`--- ${method.name} ---`);
    let passCount = 0;
    
    testCases.forEach(testCase => {
        try {
            // 使用深拷贝避免原地修改影响其他测试
            const input = JSON.parse(JSON.stringify(testCase.input));
            const result = method.func(input);
            const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
            
            console.log(`${testCase.description}: ${passed ? '✅' : '❌'} ${JSON.stringify(result)}`);
            
            if (passed) passCount++;
        } catch (error) {
            console.log(`${testCase.description}: ❌ 错误 - ${error.message}`);
        }
    });
    
    console.log(`通过率: ${passCount}/${testCases.length}\n`);
});

// ==================== 性能测试 ====================

console.log('=== 性能对比测试 ===\n');

function performanceComparison() {
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
        console.log(`--- 数据规模: ${size} ---`);
        const testData = generateTestData(size);
        
        methods.forEach(method => {
            const startTime = performance.now();
            
            // 运行多次取平均值
            const iterations = size <= 1000 ? 50 : 10;
            for (let i = 0; i < iterations; i++) {
                // 使用深拷贝避免原地修改影响
                const input = JSON.parse(JSON.stringify(testData));
                method.func(input);
            }
            
            const endTime = performance.now();
            const avgTime = (endTime - startTime) / iterations;
            
            console.log(`${method.name}: ${avgTime.toFixed(3)}ms`);
        });
        
        console.log();
    });
}

performanceComparison();

// ==================== 算法正确性验证 ====================

console.log('=== 算法正确性验证 ===\n');

function verifyConsistency() {
    const complexTestCases = [
        [[1,3],[2,6],[8,10],[15,18]],
        [[1,4],[4,5]],
        [[1,4],[0,4]],
        [[2,3],[4,5],[6,7],[8,9],[1,10]],
        [[1,4],[0,0]]
    ];
    
    complexTestCases.forEach((testCase, index) => {
        console.log(`验证测试用例 ${index + 1}: ${JSON.stringify(testCase)}`);
        
        const results = methods.map(method => ({
            name: method.name,
            result: method.func(JSON.parse(JSON.stringify(testCase)))
        }));
        
        // 检查所有方法的结果是否一致
        const firstResult = JSON.stringify(results[0].result);
        const allConsistent = results.every(r => JSON.stringify(r.result) === firstResult);
        
        console.log(`结果一致性: ${allConsistent ? '✅ 所有算法结果一致' : '❌ 算法结果不一致'}`);
        
        if (allConsistent) {
            console.log(`统一结果: ${firstResult}`);
        } else {
            results.forEach(r => {
                console.log(`  ${r.name}: ${JSON.stringify(r.result)}`);
            });
        }
        
        console.log();
    });
}

verifyConsistency();

// ==================== 模块导出 ====================

module.exports = {
    mergeStandard,
    mergeFunctional,
    mergeInPlace,
    mergeWithStack,
    mergeWithIntervalTree,
    mergeDivideConquer
};