/**
 * LeetCode 647: 回文子串数量 - 优化版本
 * 
 * 题目：给定一个字符串，你的任务是计算这个字符串中有多少个回文子串。
 * 具有不同开始位置或结束位置的子串，即使是由相同的字符组成，也会被视作不同的子串。
 */

// ==================== 方法1: 中心扩展法 (推荐) ====================

/**
 * 方法1: 中心扩展法
 * 时间复杂度: O(n²) - 每个可能的中心点最多扩展n次
 * 空间复杂度: O(1) - 只使用常数额外空间
 * 
 * 核心思想：
 * 1. 遍历每个可能的回文中心（包括字符和字符间隙）
 * 2. 从中心向两边扩展，统计以该中心的回文子串数量
 * 3. 避免了重复的子串生成和回文检查
 * 
 * 优势：
 * - 相比暴力法减少了一个维度的复杂度
 * - 不需要额外的存储空间
 * - 逻辑清晰，易于理解
 * 
 * @param {string} s - 输入字符串
 * @returns {number} 回文子串的数量
 */
function countSubstringsExpandAroundCenter(s) {
    if (!s || s.length === 0) return 0;
    
    let count = 0;
    
    // 辅助函数：从中心向外扩展计算回文数量
    function expandAroundCenter(left, right) {
        let localCount = 0;
        // 当左右指针在边界内且字符相等时继续扩展
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            localCount++;
            left--;
            right++;
        }
        return localCount;
    }
    
    for (let i = 0; i < s.length; i++) {
        // 奇数长度回文：以字符为中心
        count += expandAroundCenter(i, i);
        // 偶数长度回文：以字符间隙为中心
        count += expandAroundCenter(i, i + 1);
    }
    
    return count;
}

// ==================== 方法2: 动态规划法 ====================

/**
 * 方法2: 动态规划法
 * 时间复杂度: O(n²) - 需要填充n×n的DP表
 * 空间复杂度: O(n²) - 需要二维DP数组存储状态
 * 
 * 核心思想：
 * 1. dp[i][j] 表示从索引i到j的子串是否为回文
 * 2. 状态转移方程：dp[i][j] = (s[i] === s[j]) && (j-i <= 2 || dp[i+1][j-1])
 * 3. 统计所有为true的dp[i][j]
 * 
 * 优势：
 * - 可以同时得到所有子串的回文信息
 * - 适合需要多次查询的场景
 * - 状态转移清晰，便于扩展
 * 
 * @param {string} s - 输入字符串
 * @returns {number} 回文子串的数量
 */
function countSubstringsDynamicProgramming(s) {
    if (!s || s.length === 0) return 0;
    
    const n = s.length;
    let count = 0;
    
    // 创建DP表：dp[i][j]表示s[i...j]是否为回文
    const dp = Array(n).fill().map(() => Array(n).fill(false));
    
    // 长度为1的子串都是回文
    for (let i = 0; i < n; i++) {
        dp[i][i] = true;
        count++;
    }
    
    // 长度为2的子串
    for (let i = 0; i < n - 1; i++) {
        if (s[i] === s[i + 1]) {
            dp[i][i + 1] = true;
            count++;
        }
    }
    
    // 长度为3及以上的子串
    for (let len = 3; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            // 如果首尾字符相等且内部子串是回文，则当前子串也是回文
            if (s[i] === s[j] && dp[i + 1][j - 1]) {
                dp[i][j] = true;
                count++;
            }
        }
    }
    
    return count;
}

// ==================== 方法3: Manacher算法 (最优解) ====================

/**
 * 方法3: Manacher算法 (马拉车算法)
 * 时间复杂度: O(n) - 线性时间复杂度
 * 空间复杂度: O(n) - 需要额外数组存储半径信息
 * 
 * 核心思想：
 * 1. 预处理字符串，在每个字符间插入特殊字符（如#）
 * 2. 利用已计算的回文信息来加速新位置的计算
 * 3. 维护最右回文边界和对应的中心，利用回文的对称性
 * 
 * 优势：
 * - 线性时间复杂度，理论最优
 * - 适合处理超大字符串
 * - 算法精妙，展示高级算法思维
 * 
 * @param {string} s - 输入字符串
 * @returns {number} 回文子串的数量
 */
function countSubstringsManacher(s) {
    if (!s || s.length === 0) return 0;
    
    // 预处理：在字符间插入#，统一处理奇偶长度回文
    // 例如："abc" -> "#a#b#c#"
    const processed = '#' + s.split('').join('#') + '#';
    const n = processed.length;
    
    // P[i]表示以i为中心的回文半径
    const P = new Array(n).fill(0);
    let center = 0; // 当前最右回文的中心
    let right = 0;  // 当前最右回文的右边界
    let count = 0;
    
    for (let i = 0; i < n; i++) {
        // 利用回文的对称性
        const mirror = 2 * center - i; // i关于center的对称点
        
        // 如果i在当前最右回文内，可以利用对称性
        if (i < right) {
            P[i] = Math.min(right - i, P[mirror]);
        }
        
        // 尝试扩展以i为中心的回文
        try {
            while (i + P[i] + 1 < n && 
                   i - P[i] - 1 >= 0 && 
                   processed[i + P[i] + 1] === processed[i - P[i] - 1]) {
                P[i]++;
            }
        } catch (e) {
            // 边界处理
        }
        
        // 如果以i为中心的回文扩展超过了right，更新center和right
        if (i + P[i] > right) {
            center = i;
            right = i + P[i];
        }
        
        // 计算以i为中心的回文子串数量
        // P[i]就是以i为中心的回文半径，也等于回文子串的数量
        count += Math.ceil(P[i] / 2);
    }
    
    return count;
}

// ==================== 方法4: 优化的暴力法 ====================

/**
 * 方法4: 优化的暴力法
 * 时间复杂度: O(n²) - 避免了substring操作和额外的回文检查
 * 空间复杂度: O(1) - 只使用常数额外空间
 * 
 * 核心思想：
 * 1. 直接在原字符串上进行回文检查，避免substring操作
 * 2. 一旦发现不是回文就立即跳出，减少不必要的比较
 * 
 * 优势：
 * - 相比原始暴力法减少了字符串操作开销
 * - 逻辑简单，易于理解和实现
 * - 空间效率高
 * 
 * @param {string} s - 输入字符串
 * @returns {number} 回文子串的数量
 */
function countSubstringsOptimizedBruteForce(s) {
    if (!s || s.length === 0) return 0;
    
    let count = 0;
    const n = s.length;
    
    // 检查从i到j的子串是否为回文
    function isPalindromeInPlace(start, end) {
        while (start < end) {
            if (s[start] !== s[end]) {
                return false;
            }
            start++;
            end--;
        }
        return true;
    }
    
    // 遍历所有可能的子串
    for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
            if (isPalindromeInPlace(i, j)) {
                count++;
            }
        }
    }
    
    return count;
}

// ==================== 方法5: 递归+记忆化 ====================

/**
 * 方法5: 递归+记忆化
 * 时间复杂度: O(n²) - 每个子问题只计算一次
 * 空间复杂度: O(n²) - 记忆化存储 + 递归栈空间
 * 
 * 核心思想：
 * 1. 使用递归的方式检查回文
 * 2. 用Map缓存已计算的结果，避免重复计算
 * 3. 自顶向下的动态规划思想
 * 
 * @param {string} s - 输入字符串
 * @returns {number} 回文子串的数量
 */
function countSubstringsMemoization(s) {
    if (!s || s.length === 0) return 0;
    
    const memo = new Map();
    let count = 0;
    
    function isPalindrome(i, j) {
        const key = `${i}-${j}`;
        if (memo.has(key)) {
            return memo.get(key);
        }
        
        let result;
        if (i >= j) {
            result = true;
        } else if (s[i] !== s[j]) {
            result = false;
        } else {
            result = isPalindrome(i + 1, j - 1);
        }
        
        memo.set(key, result);
        return result;
    }
    
    for (let i = 0; i < s.length; i++) {
        for (let j = i; j < s.length; j++) {
            if (isPalindrome(i, j)) {
                count++;
            }
        }
    }
    
    return count;
}

// ==================== 测试用例 ====================

console.log('=== 回文子串数量问题 - 优化版本测试 ===\n');

// 测试数据
const testCases = [
    { input: "", expected: 0, description: "空字符串" },
    { input: "a", expected: 1, description: "单字符" },
    { input: "aa", expected: 3, description: "两个相同字符" },
    { input: "abc", expected: 3, description: "三个不同字符" },
    { input: "aaa", expected: 6, description: "三个相同字符" },
    { input: "aaaa", expected: 10, description: "四个相同字符" },
    { input: "racecar", expected: 10, description: "经典回文词" },
    { input: "abccba", expected: 9, description: "偶数长度回文" },
    { input: "abcdef", expected: 6, description: "无回文的字符串" },
    { input: "aabaa", expected: 9, description: "复杂回文组合" }
];

// 所有优化方法
const methods = [
    { name: "中心扩展法", func: countSubstringsExpandAroundCenter },
    { name: "动态规划法", func: countSubstringsDynamicProgramming },
    { name: "Manacher算法", func: countSubstringsManacher },
    { name: "优化暴力法", func: countSubstringsOptimizedBruteForce },
    { name: "递归记忆化", func: countSubstringsMemoization }
];

// 运行功能测试
methods.forEach(method => {
    console.log(`--- ${method.name} ---`);
    let passCount = 0;
    
    testCases.forEach(testCase => {
        try {
            const result = method.func(testCase.input);
            const passed = result === testCase.expected;
            
            console.log(`${testCase.description} ("${testCase.input}"): ${passed ? '✅' : '❌'} ${result}/${testCase.expected}`);
            
            if (passed) passCount++;
        } catch (error) {
            console.log(`${testCase.description}: ❌ 错误 - ${error.message}`);
        }
    });
    
    console.log(`通过率: ${passCount}/${testCases.length}\n`);
});

// ==================== 性能测试 ====================

console.log('=== 性能测试 ===\n');

function performanceTest() {
    // 生成测试字符串
    const generateTestString = (length, pattern = 'mixed') => {
        switch (pattern) {
            case 'same':
                return 'a'.repeat(length);
            case 'palindrome':
                const half = 'abcde'.repeat(Math.ceil(length / 10)).substring(0, Math.floor(length / 2));
                return half + (length % 2 ? 'x' : '') + half.split('').reverse().join('');
            case 'mixed':
            default:
                return Array.from({length}, (_, i) => String.fromCharCode(97 + (i % 26))).join('');
        }
    };
    
    const testSizes = [50, 100, 200];
    const patterns = ['same', 'mixed', 'palindrome'];
    
    patterns.forEach(pattern => {
        console.log(`--- ${pattern.toUpperCase()} 模式 ---`);
        
        testSizes.forEach(size => {
            console.log(`字符串长度: ${size}`);
            const testString = generateTestString(size, pattern);
            
            methods.forEach(method => {
                const startTime = performance.now();
                
                // 运行多次取平均值
                const iterations = size <= 100 ? 100 : 10;
                for (let i = 0; i < iterations; i++) {
                    method.func(testString);
                }
                
                const endTime = performance.now();
                const avgTime = (endTime - startTime) / iterations;
                
                console.log(`  ${method.name}: ${avgTime.toFixed(3)}ms`);
            });
            
            console.log();
        });
    });
}

performanceTest();

// ==================== 算法正确性验证 ====================

console.log('=== 算法正确性验证 ===\n');

function verifyConsistency() {
    const complexTestCases = [
        "abcba",
        "racecar", 
        "abccba",
        "aabaa",
        "abcdef"
    ];
    
    complexTestCases.forEach(testString => {
        console.log(`验证字符串: "${testString}"`);
        
        const results = methods.map(method => ({
            name: method.name,
            result: method.func(testString)
        }));
        
        // 检查所有方法的结果是否一致
        const firstResult = results[0].result;
        const allConsistent = results.every(r => r.result === firstResult);
        
        console.log(`结果一致性: ${allConsistent ? '✅ 所有算法结果一致' : '❌ 算法结果不一致'}`);
        
        if (allConsistent) {
            console.log(`统一结果: ${firstResult}`);
        } else {
            results.forEach(r => {
                console.log(`  ${r.name}: ${r.result}`);
            });
        }
        
        console.log();
    });
}

verifyConsistency();

// ==================== 模块导出 ====================

module.exports = {
    countSubstringsExpandAroundCenter,
    countSubstringsDynamicProgramming,
    countSubstringsManacher,
    countSubstringsOptimizedBruteForce,
    countSubstringsMemoization
};