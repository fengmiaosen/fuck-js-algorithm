
// 拆解URL参数中queryString，返回一个 key - value 形式的 object
// 入参格式参考：const url = 'http://sample.com/?a=1&b=2&c=xx&d=#hash';
// 出参格式参考：const result = { a: '1', b: '2', c: 'xx', d: '' };

/**
 * 方法一：使用 URL API（现代浏览器推荐）
 * 优点：简洁、标准、自动处理编码
 * 缺点：IE不支持，Node.js需要polyfill
 * @param {string} url - 完整的URL字符串
 * @returns {Object} 解析后的查询参数对象
 */
function parseQueryModern(url) {
    try {
        const urlObj = new URL(url);
        const queryObj = {};
        
        // 使用 URLSearchParams 迭代器
        for (const [key, value] of urlObj.searchParams) {
            queryObj[key] = value;
        }
        
        return queryObj;
    } catch (error) {
        console.warn('URL解析失败:', error.message);
        return {};
    }
}

/**
 * 方法二：使用 URLSearchParams（兼容性较好）
 * 优点：专门处理查询字符串，支持重复参数
 * 缺点：IE不支持
 * @param {string} url - 完整的URL字符串
 * @returns {Object} 解析后的查询参数对象
 */
function parseQueryURLSearchParams(url) {
    try {
        // 提取查询字符串部分
        const queryString = url.split('?')[1]?.split('#')[0] || '';
        const searchParams = new URLSearchParams(queryString);
        const queryObj = {};
        
        for (const [key, value] of searchParams) {
            queryObj[key] = value;
        }
        
        return queryObj;
    } catch (error) {
        console.warn('URLSearchParams解析失败:', error.message);
        return {};
    }
}

/**
 * 方法三：手动解析（最佳兼容性）
 * 优点：兼容所有浏览器，包括IE
 * 缺点：需要手动处理编码和边界情况
 * @param {string} url - 完整的URL字符串
 * @returns {Object} 解析后的查询参数对象
 */
function parseQueryManual(url) {
    if (!url || typeof url !== 'string') {
        return {};
    }
    
    try {
        // 提取查询字符串：去掉协议、域名、路径和hash
        let queryString = '';
        
        // 找到 ? 的位置
        const questionIndex = url.indexOf('?');
        if (questionIndex === -1) {
            return {}; // 没有查询参数
        }
        
        // 提取 ? 之后的部分
        const afterQuestion = url.substring(questionIndex + 1);
        
        // 去掉 hash 部分（# 之后的内容）
        // http://www.abc.com/#/path/to/page?id=1
        const hashIndex = afterQuestion.indexOf('#');
        queryString = hashIndex === -1 ? afterQuestion : afterQuestion.substring(0, hashIndex);
        
        if (!queryString) {
            return {};
        }
        
        const queryObj = {};
        
        // 按 & 分割参数
        const pairs = queryString.split('&');
        
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            if (!pair) continue; // 跳过空字符串
            
            // 按 = 分割键值对
            const equalIndex = pair.indexOf('=');
            let key, value;
            
            if (equalIndex === -1) {
                // 没有 =，整个字符串作为key，value为空字符串
                key = pair;
                value = '';
            } else {
                key = pair.substring(0, equalIndex);
                value = pair.substring(equalIndex + 1);
            }
            
            // URL解码
            try {
                key = decodeURIComponent(key);
                value = decodeURIComponent(value);
            } catch (e) {
                // 解码失败时保持原值
                console.warn('URL解码失败:', e.message);
            }
            
            // 处理重复参数：后面的值覆盖前面的值
            queryObj[key] = value;
        }
        
        return queryObj;
    } catch (error) {
        console.warn('手动解析失败:', error.message);
        return {};
    }
}

/**
 * 方法四：增强版手动解析（支持数组参数）
 * 优点：支持重复参数转为数组，处理更多边界情况
 * @param {string} url - 完整的URL字符串
 * @param {Object} options - 配置选项
 * @returns {Object} 解析后的查询参数对象
 */
function parseQueryAdvanced(url, options = {}) {
    const {
        arrayFormat = 'bracket', // 'bracket': a[]=1&a[]=2, 'repeat': a=1&a=2
        parseNumbers = false,     // 是否将数字字符串转为数字
        parseBooleans = false,    // 是否将布尔字符串转为布尔值
        decode = true            // 是否进行URL解码
    } = options;
    
    if (!url || typeof url !== 'string') {
        return {};
    }
    
    try {
        // 提取查询字符串
        const questionIndex = url.indexOf('?');
        if (questionIndex === -1) {
            return {};
        }
        
        const afterQuestion = url.substring(questionIndex + 1);
        const hashIndex = afterQuestion.indexOf('#');
        const queryString = hashIndex === -1 ? afterQuestion : afterQuestion.substring(0, hashIndex);
        
        if (!queryString) {
            return {};
        }
        
        const queryObj = {};
        const pairs = queryString.split('&');
        
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            if (!pair) continue;
            
            const equalIndex = pair.indexOf('=');
            let key, value;
            
            if (equalIndex === -1) {
                key = pair;
                value = '';
            } else {
                key = pair.substring(0, equalIndex);
                value = pair.substring(equalIndex + 1);
            }
            
            // URL解码
            if (decode) {
                try {
                    key = decodeURIComponent(key);
                    value = decodeURIComponent(value);
                } catch (e) {
                    console.warn('URL解码失败:', e.message);
                }
            }
            
            // 处理数组格式
            let finalKey = key;
            let isArray = false;
            
            if (arrayFormat === 'bracket' && key.endsWith('[]')) {
                finalKey = key.slice(0, -2);
                isArray = true;
            } else if (arrayFormat === 'repeat' && queryObj.hasOwnProperty(key)) {
                finalKey = key;
                isArray = true;
            }
            
            // 类型转换
            let finalValue = value;
            if (parseNumbers && /^\d+(\.\d+)?$/.test(value)) {
                finalValue = parseFloat(value);
            } else if (parseBooleans) {
                if (value === 'true') finalValue = true;
                else if (value === 'false') finalValue = false;
            }
            
            // 设置值
            if (isArray) {
                if (!queryObj[finalKey]) {
                    queryObj[finalKey] = [];
                } else if (!Array.isArray(queryObj[finalKey])) {
                    queryObj[finalKey] = [queryObj[finalKey]];
                }
                queryObj[finalKey].push(finalValue);
            } else {
                queryObj[finalKey] = finalValue;
            }
        }
        
        return queryObj;
    } catch (error) {
        console.warn('增强解析失败:', error.message);
        return {};
    }
}

/**
 * 通用解析函数（自动选择最佳方法）
 * @param {string} url - 完整的URL字符串
 * @param {Object} options - 配置选项
 * @returns {Object} 解析后的查询参数对象
 */
function parseQuery(url, options = {}) {
    const { method = 'auto' } = options;
    
    switch (method) {
        case 'modern':
            return parseQueryModern(url);
        case 'urlsearchparams':
            return parseQueryURLSearchParams(url);
        case 'manual':
            return parseQueryManual(url);
        case 'advanced':
            return parseQueryAdvanced(url, options);
        case 'auto':
        default:
            // 自动选择：优先使用现代API，降级到手动解析
            if (typeof URL !== 'undefined' && typeof URLSearchParams !== 'undefined') {
                return parseQueryModern(url);
            } else if (typeof URLSearchParams !== 'undefined') {
                return parseQueryURLSearchParams(url);
            } else {
                return parseQueryManual(url);
            }
    }
}

// ==================== 测试用例 ====================

console.log('=== URL查询参数解析测试 ===\n');

// 基础测试
console.log('1. 基础功能测试:');
const basicUrl = 'http://sample.com/?a=1&b=2&c=xx&d=#hash';
console.log('输入:', basicUrl);
console.log('现代API:', parseQueryModern(basicUrl));
console.log('手动解析:', parseQueryManual(basicUrl));
console.log('');

// 边界情况测试
console.log('2. 边界情况测试:');
const testCases = [
    'http://example.com/',                    // 无查询参数
    'http://example.com/?',                   // 只有问号
    'http://example.com/?a',                  // 无值参数
    'http://example.com/?a=',                 // 空值参数
    'http://example.com/?a=1&',               // 末尾&
    'http://example.com/?&a=1',               // 开头&
    'http://example.com/?a=1&&b=2',           // 连续&
    'http://example.com/?a=1&b=2#fragment',   // 带fragment
    'http://example.com/?a=hello%20world',    // URL编码
    'http://example.com/?a=1&a=2',            // 重复参数
];

testCases.forEach((url, index) => {
    console.log(`测试 ${index + 1}: ${url}`);
    console.log('结果:', parseQueryManual(url));
    console.log('');
});

// 特殊字符测试
console.log('3. 特殊字符测试:');
const specialUrl = 'http://example.com/?name=张三&email=test%40example.com&tags=tag1%2Ctag2&chinese=你好世界';
console.log('输入:', specialUrl);
console.log('结果:', parseQueryManual(specialUrl));
console.log('');

// 数组参数测试
console.log('4. 数组参数测试:');
const arrayUrl1 = 'http://example.com/?colors[]=red&colors[]=blue&colors[]=green';
const arrayUrl2 = 'http://example.com/?tags=js&tags=react&tags=vue';
console.log('括号格式:', arrayUrl1);
console.log('结果:', parseQueryAdvanced(arrayUrl1, { arrayFormat: 'bracket' }));
console.log('重复格式:', arrayUrl2);
console.log('结果:', parseQueryAdvanced(arrayUrl2, { arrayFormat: 'repeat' }));
console.log('');

// 类型转换测试
console.log('5. 类型转换测试:');
const typeUrl = 'http://example.com/?age=25&price=99.99&active=true&disabled=false&name=john';
console.log('输入:', typeUrl);
console.log('默认:', parseQueryAdvanced(typeUrl));
console.log('转换数字和布尔:', parseQueryAdvanced(typeUrl, { 
    parseNumbers: true, 
    parseBooleans: true 
}));
console.log('');

// 性能测试
console.log('6. 性能测试 (1000次迭代):');
const perfUrl = 'http://example.com/?a=1&b=2&c=3&d=4&e=5&f=6&g=7&h=8&i=9&j=10';

function performanceTest(fn, name) {
    const start = Date.now();
    for (let i = 0; i < 1000; i++) {
        fn(perfUrl);
    }
    const end = Date.now();
    console.log(`${name}: ${end - start}ms`);
}

if (typeof URL !== 'undefined') {
    performanceTest(parseQueryModern, '现代API');
}
if (typeof URLSearchParams !== 'undefined') {
    performanceTest(parseQueryURLSearchParams, 'URLSearchParams');
}
performanceTest(parseQueryManual, '手动解析');
performanceTest(parseQueryAdvanced, '增强解析');

console.log('\n=== 测试完成 ===');
console.log('推荐使用 parseQuery() 函数，它会自动选择最佳解析方法');

// 导出函数（Node.js环境）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        parseQuery,
        parseQueryModern,
        parseQueryURLSearchParams,
        parseQueryManual,
        parseQueryAdvanced
    };
}

// 浏览器环境全局导出
if (typeof window !== 'undefined') {
    window.parseQuery = parseQuery;
    window.parseQueryUtils = {
        parseQuery,
        parseQueryModern,
        parseQueryURLSearchParams,
        parseQueryManual,
        parseQueryAdvanced
    };
}