// 写一个数组去重函数

// 如传入的数组元素为[123, "meili", "123", "mogu", 123]，则输出：[123, "meili", "123", "mogu"]
// 如传入的数组元素为[123, [1, 2, 3], [1, "2", 3], [1, 2, 3], "meili"]，则输出：[123, [1, 2, 3], [1, "2", 3], "meili"]
// 如传入的数组元素为[123, {a: 1}, {a: {b: 1}}, {a: "1"}, {a: {b: 1}}, "meili"]，则输出：[123, {a: 1}, {a: {b: 1}}, {a: "1"}, "meili"]

/**
 * 深度比较两个值是否相等
 * @param {*} a - 第一个值
 * @param {*} b - 第二个值
 * @returns {boolean} 是否相等
 */
function deepEqual(a, b) {
    // 严格相等检查
    if (a === b) return true;
    
    // 类型不同直接返回false
    if (typeof a !== typeof b) return false;
    
    // null 和 undefined 的特殊处理
    if (a == null || b == null) return a === b;
    
    // 数组比较
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!deepEqual(a[i], b[i])) return false;
        }
        return true;
    }
    
    // 对象比较
    if (typeof a === 'object' && typeof b === 'object') {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        
        if (keysA.length !== keysB.length) return false;
        
        for (let key of keysA) {
            if (!keysB.includes(key)) return false;
            if (!deepEqual(a[key], b[key])) return false;
        }
        return true;
    }
    
    return false;
}

/**
 * 数组去重函数（支持深度比较）
 * @param {Array} arr - 需要去重的数组
 * @returns {Array} 去重后的数组
 */
function uniqueArray(arr) {
    if (!Array.isArray(arr)) {
        throw new Error('参数必须是数组');
    }
    
    const result = [];
    
    for (let i = 0; i < arr.length; i++) {
        const current = arr[i];
        let isDuplicate = false;
        
        // 检查当前元素是否已存在于结果数组中
        for (let j = 0; j < result.length; j++) {
            if (deepEqual(current, result[j])) {
                isDuplicate = true;
                break;
            }
        }
        
        // 如果不是重复元素，添加到结果数组
        if (!isDuplicate) {
            result.push(current);
        }
    }
    
    return result;
}

/**
 * 优化版本：使用 JSON.stringify 进行快速比较（适用于可序列化对象）
 * @param {Array} arr - 需要去重的数组
 * @returns {Array} 去重后的数组
 */
function uniqueArrayFast(arr) {
    if (!Array.isArray(arr)) {
        throw new Error('参数必须是数组');
    }
    
    const seen = new Set();
    const result = [];
    
    for (const item of arr) {
        let key;
        
        // 对于基本类型，直接使用值作为key
        if (typeof item !== 'object' || item === null) {
            key = item;
        } else {
            // 对于对象和数组，使用JSON序列化作为key
            try {
                key = JSON.stringify(item);
            } catch (e) {
                // 如果序列化失败，回退到深度比较
                let isDuplicate = false;
                for (const existing of result) {
                    if (deepEqual(item, existing)) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    result.push(item);
                }
                continue;
            }
        }
        
        if (!seen.has(key)) {
            seen.add(key);
            result.push(item);
        }
    }
    
    return result;
}

// 测试用例
console.log('=== 测试用例 1 ===');
const test1 = [123, "meili", "123", "mogu", 123];
console.log('输入:', test1);
console.log('输出:', uniqueArray(test1));
console.log('期望:', [123, "meili", "123", "mogu"]);

console.log('\n=== 测试用例 2 ===');
const test2 = [123, [1, 2, 3], [1, "2", 3], [1, 2, 3], "meili"];
console.log('输入:', test2);
console.log('输出:', uniqueArray(test2));
console.log('期望:', [123, [1, 2, 3], [1, "2", 3], "meili"]);

console.log('\n=== 测试用例 3 ===');
const test3 = [123, {a: 1}, {a: {b: 1}}, {a: "1"}, {a: {b: 1}}, "meili"];
console.log('输入:', test3);
console.log('输出:', uniqueArray(test3));
console.log('期望:', [123, {a: 1}, {a: {b: 1}}, {a: "1"}, "meili"]);

console.log('\n=== 性能测试 ===');
const largeArray = [];
for (let i = 0; i < 1000; i++) {
    largeArray.push(i % 100); // 创建有重复的大数组
}

console.time('深度比较版本');
uniqueArray(largeArray.slice());
console.timeEnd('深度比较版本');

console.time('优化版本');
uniqueArrayFast(largeArray.slice());
console.timeEnd('优化版本');

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { uniqueArray, uniqueArrayFast, deepEqual };
}

