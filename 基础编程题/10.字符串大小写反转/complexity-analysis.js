/**
 * 字符串大小写反转 - 复杂度分析
 * 分析两个实现方法的时间复杂度和空间复杂度
 */

// 原始实现
function reverseStr(str) {
    var res = [];

    for (const char of str) {
        var s = char.toLocaleUpperCase() === char ?
            char.toLocaleLowerCase() :
            char.toLocaleUpperCase();

        res.push(s);
    }

    return res.join('');
}

// 优化性能的实现
function reverseStrFast(str) {
    // 直接操作字符串，避免数组push和join
    let result = '';
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        // 只处理英文字母，其他字符直接拼接
        if (code >= 65 && code <= 90) {
            // 大写转小写
            result += String.fromCharCode(code + 32);
        } else if (code >= 97 && code <= 122) {
            // 小写转大写
            result += String.fromCharCode(code - 32);
        } else {
            result += str[i];
        }
    }
    return result;
}

// ==================== 复杂度分析 ====================

console.log('=== 复杂度分析 ===\n');

/**
 * reverseStr 方法分析：
 * 
 * 时间复杂度：O(n)
 * - 遍历字符串：O(n)
 * - toLocaleUpperCase() 和 toLocaleLowerCase()：O(1) 每个字符
 * - 数组 push 操作：O(1) 平均情况
 * - 数组 join 操作：O(n)
 * - 总计：O(n) + O(n) = O(n)
 * 
 * 空间复杂度：O(n)
 * - 创建数组 res：O(n)
 * - 临时变量 s：O(1)
 * - 总计：O(n)
 * 
 * 性能瓶颈：
 * 1. 每次调用 toLocaleUpperCase() 和 toLocaleLowerCase() 都有开销
 * 2. 数组操作（push + join）比直接字符串拼接慢
 * 3. 需要额外的数组空间
 */

/**
 * reverseStrFast 方法分析：
 * 
 * 时间复杂度：O(n)
 * - 遍历字符串：O(n)
 * - charCodeAt() 操作：O(1) 每个字符
 * - 字符串拼接：O(1) 每个字符（现代JS引擎优化）
 * - String.fromCharCode()：O(1) 每个字符
 * - 总计：O(n)
 * 
 * 空间复杂度：O(n)
 * - 创建结果字符串：O(n)
 * - 临时变量 code：O(1)
 * - 总计：O(n)
 * 
 * 性能优势：
 * 1. 使用 ASCII 码直接计算，避免字符串方法调用
 * 2. 直接字符串拼接，避免数组操作
 * 3. 更少的函数调用开销
 */

// ==================== 性能测试 ====================

console.log('=== 性能测试 ===\n');

// 创建测试数据
const testStrings = [
    'Hello World',                    // 短字符串
    'JavaScript Programming',         // 中等字符串
    'A'.repeat(1000),                 // 长字符串，全大写
    'a'.repeat(1000),                 // 长字符串，全小写
    'AbCdEfGhIjKlMnOpQrStUvWxYz'.repeat(50), // 混合大小写长字符串
    'Hello123World!@#$%',            // 包含非字母字符
];

function testPerformance(fn, name, str, iterations = 10000) {
    const start = performance.now();
    
    for (let i = 0; i < iterations; i++) {
        fn(str);
    }
    
    const end = performance.now();
    const totalTime = end - start;
    const avgTime = totalTime / iterations;
    
    return {
        name,
        totalTime: totalTime.toFixed(2),
        avgTime: avgTime.toFixed(6),
        iterations
    };
}

// 测试每个字符串的性能
testStrings.forEach((testStr, index) => {
    console.log(`测试 ${index + 1}: "${testStr.substring(0, 20)}${testStr.length > 20 ? '...' : ''}" (长度: ${testStr.length})`);
    
    const result1 = testPerformance(reverseStr, 'reverseStr', testStr, 1000);
    const result2 = testPerformance(reverseStrFast, 'reverseStrFast', testStr, 1000);
    
    console.log(`  ${result1.name}: ${result1.avgTime}ms (平均) / ${result1.totalTime}ms (总计)`);
    console.log(`  ${result2.name}: ${result2.avgTime}ms (平均) / ${result2.totalTime}ms (总计)`);
    
    const speedup = (parseFloat(result1.avgTime) / parseFloat(result2.avgTime)).toFixed(2);
    console.log(`  性能提升: ${speedup}x\n`);
});

// ==================== 内存使用分析 ====================

console.log('=== 内存使用分析 ===\n');

function analyzeMemoryUsage(fn, str, name) {
    const initialMemory = process.memoryUsage().heapUsed;
    
    // 执行函数多次
    for (let i = 0; i < 1000; i++) {
        fn(str);
    }
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryUsed = finalMemory - initialMemory;
    
    console.log(`${name}: ${(memoryUsed / 1024).toFixed(2)} KB`);
}

if (typeof process !== 'undefined' && process.memoryUsage) {
    const longStr = 'AbCdEfGhIjKlMnOpQrStUvWxYz'.repeat(100);
    analyzeMemoryUsage(reverseStr, longStr, 'reverseStr');
    analyzeMemoryUsage(reverseStrFast, longStr, 'reverseStrFast');
} else {
    console.log('内存分析需要 Node.js 环境');
}

// ==================== 正确性测试 ====================

console.log('\n=== 正确性测试 ===\n');

const testCases = [
    'Hello World',
    'JavaScript',
    '123ABCdef',
    '!@#$%^&*()',
    'aBcDeFgHiJ',
    'ZYXWVUTSRQ',
    'Hello123World!@#'
];

testCases.forEach(testCase => {
    const result1 = reverseStr(testCase);
    const result2 = reverseStrFast(testCase);
    
    console.log(`输入: "${testCase}"`);
    console.log(`reverseStr: "${result1}"`);
    console.log(`reverseStrFast: "${result2}"`);
    console.log(`结果一致: ${result1 === result2 ? '✅' : '❌'}\n`);
});

// ==================== 总结 ====================

console.log('=== 总结 ===\n');

console.log('时间复杂度对比:');
console.log('  reverseStr: O(n) - 遍历 + 数组操作 + join');
console.log('  reverseStrFast: O(n) - 遍历 + 字符串拼接');
console.log('  两者时间复杂度相同，但常数因子不同\n');

console.log('空间复杂度对比:');
console.log('  reverseStr: O(n) - 需要额外数组空间');
console.log('  reverseStrFast: O(n) - 只需要结果字符串空间');
console.log('  两者空间复杂度相同，但实际内存使用不同\n');

console.log('性能差异原因:');
console.log('  1. reverseStr 使用 toLocaleUpperCase/toLocaleLowerCase 方法调用');
console.log('  2. reverseStr 需要数组 push + join 操作');
console.log('  3. reverseStrFast 使用 ASCII 码直接计算');
console.log('  4. reverseStrFast 直接字符串拼接，避免中间数组');

console.log('\n推荐使用: reverseStrFast (性能更优)');




