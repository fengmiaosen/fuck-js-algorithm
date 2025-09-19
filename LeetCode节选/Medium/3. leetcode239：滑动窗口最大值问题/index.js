// 给定一个数组 nums 和滑动窗口的大小 k，请找出所有滑动窗口里的最大值。

// 示例:

// 输入: nums = [1,3,-1,-3,5,3,6,7], 和 k = 3
// 输出: [3,3,5,5,6,7] 
// 解释:

// 滑动窗口的位置 最大值

// [1 3 -1] -3 5 3 6 7 -> 3
// 1 [3 -1 -3] 5 3 6 7 -> 3
// 1 3 [-1 -3 5] 3 6 7 -> 5
// 1 3 -1 [-3 5 3] 6 7 -> 5
// 1 3 -1 -3 [5 3 6] 7 -> 6
// 1 3 -1 -3 5 [3 6 7] -> 7

// 提示：

// 你可以假设 k 总是有效的，在输入数组不为空的情况下，1 ≤ k ≤ 输入数组的大小

/**
 * 方法1: 暴力解法
 * 时间复杂度: O(n*k) - 对每个窗口都要遍历k个元素找最大值
 * 空间复杂度: O(1) - 只使用常数额外空间
 * 
 * 思路：对每个滑动窗口，遍历窗口内所有元素找到最大值
 * 
 * @param {number[]} nums - 输入数组
 * @param {number} k - 滑动窗口大小
 * @return {number[]} - 每个窗口的最大值数组
 */
function maxSlidingWindowBruteForce(nums, k) {
    if (!nums || nums.length === 0 || k <= 0) return [];
    if (k === 1) return nums;
    if (k >= nums.length) return [Math.max(...nums)];
    
    const result = [];
    
    // 遍历每个可能的窗口起始位置
    for (let i = 0; i <= nums.length - k; i++) {
        let max = nums[i];
        // 在当前窗口中找最大值
        for (let j = i + 1; j < i + k; j++) {
            max = Math.max(max, nums[j]);
        }
        result.push(max);
    }
    
    return result;
}

/**
 * 方法2: 双端队列优化解法（单调递减队列）
 * 时间复杂度: O(n) - 每个元素最多入队和出队一次
 * 空间复杂度: O(k) - 队列最多存储k个元素的索引
 * 
 * 思路：维护一个单调递减的双端队列，队列头部始终是当前窗口的最大值
 * 队列存储的是数组索引，而不是值本身
 * 
 * @param {number[]} nums - 输入数组
 * @param {number} k - 滑动窗口大小
 * @return {number[]} - 每个窗口的最大值数组
 */
function maxSlidingWindowDeque(nums, k) {
    if (!nums || nums.length === 0 || k <= 0) return [];
    if (k === 1) return nums;
    if (k >= nums.length) return [Math.max(...nums)];
    
    const result = [];
    const deque = []; // 存储数组索引，保持单调递减
    
    for (let i = 0; i < nums.length; i++) {
        // 移除队列中超出窗口范围的索引
        while (deque.length > 0 && deque[0] < i - k + 1) {
            deque.shift();
        }
        
        // 移除队列尾部所有小于当前元素的索引
        // 保持队列单调递减性质
        while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
            deque.pop();
        }
        
        // 将当前索引加入队列
        deque.push(i);
        
        // 当窗口形成时，队列头部就是最大值的索引
        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }
    
    return result;
}

/**
 * 方法3: 分块处理解法
 * 时间复杂度: O(n) - 预处理O(n) + 查询O(n)
 * 空间复杂度: O(n) - 需要额外数组存储预处理结果
 * 
 * 思路：将数组分成大小为k的块，预处理每个块内的前缀最大值和后缀最大值
 * 对于跨块的窗口，最大值是左块后缀最大值和右块前缀最大值的较大者
 * 
 * @param {number[]} nums - 输入数组
 * @param {number} k - 滑动窗口大小
 * @return {number[]} - 每个窗口的最大值数组
 */
function maxSlidingWindowBlock(nums, k) {
    if (!nums || nums.length === 0 || k <= 0) return [];
    if (k === 1) return nums;
    if (k >= nums.length) return [Math.max(...nums)];
    
    const n = nums.length;
    const prefixMax = new Array(n); // 每个块内的前缀最大值
    const suffixMax = new Array(n); // 每个块内的后缀最大值
    
    // 预处理：计算每个块内的前缀和后缀最大值
    for (let i = 0; i < n; i++) {
        if (i % k === 0) {
            // 块的开始
            prefixMax[i] = nums[i];
        } else {
            prefixMax[i] = Math.max(prefixMax[i - 1], nums[i]);
        }
        
        const j = n - i - 1;
        if ((j + 1) % k === 0) {
            // 块的结束
            suffixMax[j] = nums[j];
        } else {
            suffixMax[j] = Math.max(suffixMax[j + 1], nums[j]);
        }
    }
    
    const result = [];
    
    // 对每个窗口，最大值是右端点的前缀最大值和左端点的后缀最大值的较大者
    for (let i = 0; i <= n - k; i++) {
        const left = i;
        const right = i + k - 1;
        result.push(Math.max(suffixMax[left], prefixMax[right]));
    }
    
    return result;
}

/**
 * 方法4: 线段树解法
 * 时间复杂度: O(n log n) - 构建线段树O(n) + n次查询每次O(log n)
 * 空间复杂度: O(n) - 线段树需要O(n)空间
 * 
 * 思路：构建线段树支持区间最大值查询，对每个窗口进行区间查询
 * 
 * @param {number[]} nums - 输入数组
 * @param {number} k - 滑动窗口大小
 * @return {number[]} - 每个窗口的最大值数组
 */
function maxSlidingWindowSegmentTree(nums, k) {
    if (!nums || nums.length === 0 || k <= 0) return [];
    if (k === 1) return nums;
    if (k >= nums.length) return [Math.max(...nums)];
    
    const n = nums.length;
    
    // 线段树类
    class SegmentTree {
        constructor(arr) {
            this.n = arr.length;
            this.tree = new Array(4 * this.n);
            this.build(arr, 0, 0, this.n - 1);
        }
        
        build(arr, node, start, end) {
            if (start === end) {
                this.tree[node] = arr[start];
            } else {
                const mid = Math.floor((start + end) / 2);
                this.build(arr, 2 * node + 1, start, mid);
                this.build(arr, 2 * node + 2, mid + 1, end);
                this.tree[node] = Math.max(this.tree[2 * node + 1], this.tree[2 * node + 2]);
            }
        }
        
        query(node, start, end, l, r) {
            if (r < start || end < l) {
                return -Infinity;
            }
            if (l <= start && end <= r) {
                return this.tree[node];
            }
            const mid = Math.floor((start + end) / 2);
            const leftMax = this.query(2 * node + 1, start, mid, l, r);
            const rightMax = this.query(2 * node + 2, mid + 1, end, l, r);
            return Math.max(leftMax, rightMax);
        }
        
        queryRange(l, r) {
            return this.query(0, 0, this.n - 1, l, r);
        }
    }
    
    const segTree = new SegmentTree(nums);
    const result = [];
    
    for (let i = 0; i <= n - k; i++) {
        result.push(segTree.queryRange(i, i + k - 1));
    }
    
    return result;
}

// ==================== 测试用例 ====================

console.log('=== 滑动窗口最大值问题测试 ===\n');

// 测试数据
const testCases = [
    {
        name: '示例1: 基本情况',
        nums: [1, 3, -1, -3, 5, 3, 6, 7],
        k: 3,
        expected: [3, 3, 5, 5, 6, 7]
    },
    {
        name: '示例2: 窗口大小为1',
        nums: [1, 3, -1, -3, 5, 3, 6, 7],
        k: 1,
        expected: [1, 3, -1, -3, 5, 3, 6, 7]
    },
    {
        name: '示例3: 窗口大小等于数组长度',
        nums: [1, 3, -1, -3, 5],
        k: 5,
        expected: [5]
    },
    {
        name: '示例4: 递增数组',
        nums: [1, 2, 3, 4, 5],
        k: 3,
        expected: [3, 4, 5]
    },
    {
        name: '示例5: 递减数组',
        nums: [5, 4, 3, 2, 1],
        k: 3,
        expected: [5, 4, 3]
    },
    {
        name: '示例6: 相同元素',
        nums: [2, 2, 2, 2, 2],
        k: 3,
        expected: [2, 2, 2]
    },
    {
        name: '示例7: 负数数组',
        nums: [-1, -3, -2, -5, -4],
        k: 2,
        expected: [-1, -2, -2, -4]
    },
    {
        name: '示例8: 单个元素',
        nums: [42],
        k: 1,
        expected: [42]
    }
];

// 测试所有实现方法
const methods = [
    { name: '暴力解法', func: maxSlidingWindowBruteForce },
    { name: '双端队列解法', func: maxSlidingWindowDeque },
    { name: '分块处理解法', func: maxSlidingWindowBlock },
    { name: '线段树解法', func: maxSlidingWindowSegmentTree }
];

// 运行功能测试
methods.forEach(method => {
    console.log(`--- ${method.name} ---`);
    let passCount = 0;
    
    testCases.forEach(testCase => {
        try {
            const result = method.func(testCase.nums, testCase.k);
            const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
            
            console.log(`${testCase.name}: ${passed ? '✅ 通过' : '❌ 失败'}`);
            if (!passed) {
                console.log(`  期望: [${testCase.expected.join(', ')}]`);
                console.log(`  实际: [${result.join(', ')}]`);
            }
            
            if (passed) passCount++;
        } catch (error) {
            console.log(`${testCase.name}: ❌ 错误 - ${error.message}`);
        }
    });
    
    console.log(`通过率: ${passCount}/${testCases.length}\n`);
});

// ==================== 边界情况测试 ====================

console.log('=== 边界情况测试 ===\n');

const edgeCases = [
    { name: '空数组', nums: [], k: 3, expected: [] },
    { name: 'k为0', nums: [1, 2, 3], k: 0, expected: [] },
    { name: 'k为负数', nums: [1, 2, 3], k: -1, expected: [] },
    { name: 'k大于数组长度', nums: [1, 2], k: 5, expected: [2] },
    { name: '大数值', nums: [2147483647, -2147483648, 1000000], k: 2, expected: [2147483647, 1000000] }
];

edgeCases.forEach(testCase => {
    console.log(`${testCase.name}:`);
    methods.forEach(method => {
        try {
            const result = method.func(testCase.nums, testCase.k);
            const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
            console.log(`  ${method.name}: ${passed ? '✅' : '❌'} [${result.join(', ')}]`);
        } catch (error) {
            console.log(`  ${method.name}: ❌ 错误 - ${error.message}`);
        }
    });
    console.log();
});

// ==================== 性能测试 ====================

console.log('=== 性能测试 ===\n');

function performanceTest() {
    // 测试不同规模的数据
    const sizes = [100, 1000, 5000];
    const k = 10;
    
    sizes.forEach(size => {
        console.log(`数组大小: ${size}, 窗口大小: ${k}`);
        
        // 生成随机测试数据
        const nums = Array.from({ length: size }, () => Math.floor(Math.random() * 1000) - 500);
        
        methods.forEach(method => {
            const startTime = performance.now();
            
            // 运行多次取平均值
            const iterations = size <= 1000 ? 100 : 10;
            for (let i = 0; i < iterations; i++) {
                method.func([...nums], k);
            }
            
            const endTime = performance.now();
            const avgTime = (endTime - startTime) / iterations;
            
            console.log(`  ${method.name}: ${avgTime.toFixed(3)}ms`);
        });
        
        console.log();
    });
}

performanceTest();

// ==================== 算法正确性验证 ====================

console.log('=== 算法正确性验证 ===\n');

function verifyConsistency() {
    const testData = [
        { nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 },
        { nums: [7, 2, 4, 6, 1, 8, 3, 5], k: 4 },
        { nums: [-1, -2, -3, -4, -5], k: 2 }
    ];
    
    testData.forEach((data, index) => {
        console.log(`验证测试 ${index + 1}: nums=[${data.nums.join(', ')}], k=${data.k}`);
        
        const results = methods.map(method => ({
            name: method.name,
            result: method.func(data.nums, data.k)
        }));
        
        // 检查所有方法的结果是否一致
        const firstResult = JSON.stringify(results[0].result);
        const allConsistent = results.every(r => JSON.stringify(r.result) === firstResult);
        
        console.log(`结果一致性: ${allConsistent ? '✅ 所有算法结果一致' : '❌ 算法结果不一致'}`);
        
        if (!allConsistent) {
            results.forEach(r => {
                console.log(`  ${r.name}: [${r.result.join(', ')}]`);
            });
        } else {
            console.log(`  统一结果: [${results[0].result.join(', ')}]`);
        }
        
        console.log();
    });
}

verifyConsistency();

// ==================== 模块导出 ====================

module.exports = {
    maxSlidingWindowBruteForce,
    maxSlidingWindowDeque,
    maxSlidingWindowBlock,
    maxSlidingWindowSegmentTree
};

