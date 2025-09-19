/**
 * 实现 lodash.snakeCase 方法
 * 将字符串转换为蛇形命名格式 (snake_case)
 * 
 * 参考资料:
 * - https://github.com/lodash/lodash/blob/master/snakeCase.js
 * - https://www.npmjs.com/package/snake-case
 * - https://bit.ly/2neWfJ2
 */

/**
 * 方法一：使用正则表达式（推荐）
 * 这是最接近 lodash 实现的方法
 * @param {string} str - 输入字符串
 * @returns {string} 蛇形命名格式的字符串
 */
function toSnakeCase(str) {
    if (!str || typeof str !== 'string') {
        return '';
    }
    
    return str
        // 匹配各种单词边界和格式
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        ?.map(word => word.toLowerCase())
        .join('_') || '';
}

/**
 * 方法二：分步处理（更易理解）
 * @param {string} str - 输入字符串
 * @returns {string} 蛇形命名格式的字符串
 */
function toSnakeCaseStep(str) {
    if (!str || typeof str !== 'string') {
        return '';
    }
    
    return str
        // 处理连续大写字母，如 XMLHttpRequest -> XML_Http_Request
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
        // 处理小写字母后跟大写字母，如 camelCase -> camel_Case
        .replace(/([a-z\d])([A-Z])/g, '$1_$2')
        // 将所有非字母数字字符替换为下划线
        .replace(/[^a-zA-Z0-9]/g, '_')
        // 移除连续的下划线
        .replace(/_+/g, '_')
        // 移除开头和结尾的下划线
        .replace(/^_|_$/g, '')
        // 转换为小写
        .toLowerCase();
}

/**
 * 方法三：使用 split 和 join（性能较好）
 * @param {string} str - 输入字符串
 * @returns {string} 蛇形命名格式的字符串
 */
function toSnakeCaseSplit(str) {
    if (!str || typeof str !== 'string') {
        return '';
    }
    
    // 先处理驼峰命名
    const withSpaces = str
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
        .replace(/([a-z\d])([A-Z])/g, '$1 $2');
    
    // 分割并过滤空字符串
    const words = withSpaces
        .split(/[^a-zA-Z0-9]+/)
        .filter(word => word.length > 0);
    
    return words
        .map(word => word.toLowerCase())
        .join('_');
}

/**
 * 方法四：完整的 lodash 风格实现
 * 包含更多边界情况处理
 * @param {string} str - 输入字符串
 * @returns {string} 蛇形命名格式的字符串
 */
function lodashSnakeCase(str) {
    if (!str || typeof str !== 'string') {
        return '';
    }
    
    // 处理特殊字符和 Unicode
    const cleanStr = str
        .replace(/[\u2019\u2018]/g, "'") // 处理智能引号
        .replace(/[^\w\s]/g, ' ') // 将非单词字符替换为空格
        .trim();
    
    if (!cleanStr) {
        return '';
    }
    
    // 使用更精确的正则表达式
    const words = cleanStr
        .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase -> camel Case
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // XMLHttp -> XML Http
        .replace(/([0-9])([A-Z])/g, '$1 $2') // version2Beta -> version2 Beta
        .replace(/([A-Z])([0-9])/g, '$1 $2') // Beta2 -> Beta 2
        .split(/\s+/)
        .filter(word => word.length > 0);
    
    return words
        .map(word => word.toLowerCase())
        .join('_');
}

/**
 * 性能测试函数
 * @param {Function} fn - 要测试的函数
 * @param {string} name - 函数名称
 * @param {Array} testCases - 测试用例
 */
function performanceTest(fn, name, testCases) {
    const start = performance.now();
    const iterations = 10000;
    
    for (let i = 0; i < iterations; i++) {
        testCases.forEach(testCase => fn(testCase));
    }
    
    const end = performance.now();
    console.log(`${name}: ${(end - start).toFixed(2)}ms`);
}

// 测试用例
const testCases = [
    // 基础测试
    'camelCase',
    'PascalCase',
    'snake_case',
    'kebab-case',
    'CONSTANT_CASE',
    
    // 复杂测试
    'some text',
    'some-mixed_string With spaces_underscores-and-hyphens',
    'AllThe-small Things',
    'IAmListeningToFMWhileLoadingDifferentURLOnMyBrowserAndAlsoEditingSomeXMLAndHTML',
    
    // 边界情况
    '',
    '   ',
    'a',
    'A',
    '123',
    'test123',
    'Test123ABC',
    'XMLHttpRequest',
    'iPhone6Plus',
    'HTML5Parser',
    'version2Beta3',
    
    // 特殊字符
    'hello@world.com',
    'user-name_123',
    'file.name.ext',
    'path/to/file',
    'query?param=value',
    
    // Unicode 和特殊情况
    'café',
    'naïve',
    'résumé',
    'hello world!',
    'test\"string',
    "it's working",
];

// 执行测试
console.log('=== lodash.snakeCase 实现测试 ===\n');

console.log('1. 基础功能测试:');
testCases.slice(0, 5).forEach(testCase => {
    console.log(`输入: "${testCase}"`);
    console.log(`方法一: "${toSnakeCase(testCase)}"`);
    console.log(`方法二: "${toSnakeCaseStep(testCase)}"`);
    console.log(`方法三: "${toSnakeCaseSplit(testCase)}"`);
    console.log(`方法四: "${lodashSnakeCase(testCase)}"`);
    console.log('');
});

console.log('2. 复杂字符串测试:');
testCases.slice(5, 9).forEach(testCase => {
    console.log(`输入: "${testCase}"`);
    console.log(`输出: "${toSnakeCase(testCase)}"`);
    console.log('');
});

console.log('3. 边界情况测试:');
testCases.slice(9, 16).forEach(testCase => {
    console.log(`输入: "${testCase}"`);
    console.log(`输出: "${toSnakeCase(testCase)}"`);
    console.log('');
});

console.log('4. 特殊字符测试:');
testCases.slice(16, 22).forEach(testCase => {
    console.log(`输入: "${testCase}"`);
    console.log(`输出: "${lodashSnakeCase(testCase)}"`);
    console.log('');
});

console.log('5. Unicode 测试:');
testCases.slice(22).forEach(testCase => {
    console.log(`输入: "${testCase}"`);
    console.log(`输出: "${lodashSnakeCase(testCase)}"`);
    console.log('');
});

// 性能测试（如果支持 performance API）
if (typeof performance !== 'undefined') {
    console.log('6. 性能测试 (10000次迭代):');
    performanceTest(toSnakeCase, '方法一(正则)', testCases.slice(0, 10));
    performanceTest(toSnakeCaseStep, '方法二(分步)', testCases.slice(0, 10));
    performanceTest(toSnakeCaseSplit, '方法三(分割)', testCases.slice(0, 10));
    performanceTest(lodashSnakeCase, '方法四(完整)', testCases.slice(0, 10));
} else {
    console.log('6. 性能测试: 当前环境不支持 performance API');
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toSnakeCase,
        toSnakeCaseStep,
        toSnakeCaseSplit,
        lodashSnakeCase,
        // 默认导出推荐的实现
        default: toSnakeCase
    };
}

// 浏览器环境
if (typeof window !== 'undefined') {
    window.snakeCaseUtils = {
        toSnakeCase,
        toSnakeCaseStep,
        toSnakeCaseSplit,
        lodashSnakeCase
    };
}

console.log('\n=== 测试完成 ===');
console.log('推荐使用方法一 (toSnakeCase)，它最接近 lodash 的实现');
console.log('如需处理更多特殊字符，可使用方法四 (lodashSnakeCase)');
