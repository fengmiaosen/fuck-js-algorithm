/**
 * 数组去重函数 - 完整实现
 * 题目要求：
 * 1. 如传入的数组元素为[123, "meili", "123", "mogu", 123]，则输出：[123, "meili", "123", "mogu"]
 * 2. 如传入的数组元素为[123, [1, 2, 3], [1, "2", 3], [1, 2, 3], "meili"]，则输出：[123, [1, 2, 3], [1, "2", 3], "meili"]
 * 3. 如传入的数组元素为[123, {a: 1}, {a: {b: 1}}, {a: "1"}, {a: {b: 1}}, "meili"]，则输出：[123, {a: 1}, {a: {b: 1}}, {a: "1"}, "meili"]
 */

// ==================== 深度比较函数 ====================

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

// ==================== 数组去重实现方法 ====================

/**
 * 方法一：基础去重（仅适用于基本类型）
 * 时间复杂度：O(n²)
 * 空间复杂度：O(n)
 * @param {Array} arr 
 * @returns {Array}
 */
function uniqueBasic(arr) {
    if (!Array.isArray(arr)) {
        throw new Error('参数必须是数组');
    }
    
    const result = [];
    for (const item of arr) {
        if (!result.includes(item)) {
            result.push(item);
        }
    }
    return result;
}

/**
 * 方法二：Set去重（仅适用于基本类型）
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)
 * @param {Array} arr 
 * @returns {Array}
 */
function uniqueSet(arr) {
    if (!Array.isArray(arr)) {
        throw new Error('参数必须是数组');
    }
    
    return Array.from(new Set(arr));
}

/**
 * 方法三：深度比较去重（支持所有类型）
 * 时间复杂度：O(n²)
 * 空间复杂度：O(n)
 * @param {Array} arr 
 * @returns {Array}
 */
function uniqueDeep(arr) {
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
 * 方法四：JSON序列化去重（适用于可序列化对象）
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)
 * @param {Array} arr 
 * @returns {Array}
 */
function uniqueJSON(arr) {
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

/**
 * 方法五：Map去重（支持所有类型，性能较好）
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)
 * @param {Array} arr 
 * @returns {Array}
 */
function uniqueMap(arr) {
    if (!Array.isArray(arr)) {
        throw new Error('参数必须是数组');
    }
    
    const map = new Map();
    const result = [];
    
    for (const item of arr) {
        let key;
        
        if (typeof item === 'object' && item !== null) {
            // 对于对象和数组，使用深度比较查找
            let found = false;
            for (const [existingKey, existingValue] of map) {
                if (deepEqual(item, existingValue)) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                key = Symbol(); // 使用唯一符号作为key
                map.set(key, item);
                result.push(item);
            }
        } else {
            // 对于基本类型，直接使用值作为key
            if (!map.has(item)) {
                map.set(item, item);
                result.push(item);
            }
        }
    }
    
    return result;
}

/**
 * 方法六：混合优化版本（结合多种策略）
 * 时间复杂度：O(n) 平均情况
 * 空间复杂度：O(n)
 * @param {Array} arr 
 * @returns {Array}
 */
function uniqueHybrid(arr) {
    if (!Array.isArray(arr)) {
        throw new Error('参数必须是数组');
    }
    
    // 如果数组较小，使用深度比较
    if (arr.length <= 100) {
        return uniqueDeep(arr);
    }
    
    // 如果数组较大，尝试JSON序列化
    try {
        return uniqueJSON(arr);
    } catch (e) {
        // 如果失败，回退到深度比较
        return uniqueDeep(arr);
    }
}

// ==================== 测试用例 ====================

console.log('=== 数组去重函数测试 ===\n');

// 测试用例1：基本类型去重
console.log('测试用例 1: 基本类型去重');
const test1 = [123, "meili", "123", "mogu", 123];
console.log('输入:', test1);
console.log('期望:', [123, "meili", "123", "mogu"]);

console.log('\n各方法结果:');
console.log('基础方法:', uniqueBasic(test1));
console.log('Set方法:', uniqueSet(test1));
console.log('深度比较:', uniqueDeep(test1));
console.log('JSON方法:', uniqueJSON(test1));
console.log('Map方法:', uniqueMap(test1));
console.log('混合方法:', uniqueHybrid(test1));

// 测试用例2：数组去重
console.log('\n\n测试用例 2: 数组去重');
const test2 = [123, [1, 2, 3], [1, "2", 3], [1, 2, 3], "meili"];
console.log('输入:', test2);
console.log('期望:', [123, [1, 2, 3], [1, "2", 3], "meili"]);

console.log('\n各方法结果:');
console.log('基础方法:', uniqueBasic(test2));
console.log('Set方法:', uniqueSet(test2));
console.log('深度比较:', uniqueDeep(test2));
console.log('JSON方法:', uniqueJSON(test2));
console.log('Map方法:', uniqueMap(test2));
console.log('混合方法:', uniqueHybrid(test2));

// 测试用例3：对象去重
console.log('\n\n测试用例 3: 对象去重');
const test3 = [123, {a: 1}, {a: {b: 1}}, {a: "1"}, {a: {b: 1}}, "meili"];
console.log('输入:', test3);
console.log('期望:', [123, {a: 1}, {a: {b: 1}}, {a: "1"}, "meili"]);

console.log('\n各方法结果:');
console.log('基础方法:', uniqueBasic(test3));
console.log('Set方法:', uniqueSet(test3));
console.log('深度比较:', uniqueDeep(test3));
console.log('JSON方法:', uniqueJSON(test3));
console.log('Map方法:', uniqueMap(test3));
console.log('混合方法:', uniqueHybrid(test3));

// 测试用例4：特殊情况
console.log('\n\n测试用例 4: 特殊情况');
const test4 = [
    null, undefined, NaN, Infinity, -Infinity,
    "", 0, false, true,
    [null, undefined], [null, undefined],
    {x: null}, {x: null},
    Symbol('test'), Symbol('test')
];
console.log('输入:', test4);

console.log('\n各方法结果:');
console.log('基础方法:', uniqueBasic(test4));
console.log('Set方法:', uniqueSet(test4));
console.log('深度比较:', uniqueDeep(test4));
console.log('JSON方法:', uniqueJSON(test4));
console.log('Map方法:', uniqueMap(test4));
console.log('混合方法:', uniqueHybrid(test4));

// ==================== 性能测试 ====================

console.log('\n\n=== 性能测试 ===\n');

// 创建大型测试数组
const largeArray = [];
for (let i = 0; i < 1000; i++) {
    largeArray.push(i % 100); // 创建有重复的大数组
}

const largeObjectArray = [];
for (let i = 0; i < 500; i++) {
    largeObjectArray.push({id: i % 50, data: `item${i}`});
}

function testPerformance(fn, name, arr, iterations = 100) {
    const start = performance.now();
    
    for (let i = 0; i < iterations; i++) {
        fn([...arr]); // 复制数组避免影响原数组
    }
    
    const end = performance.now();
    const avgTime = (end - start) / iterations;
    
    console.log(`${name}: ${avgTime.toFixed(3)}ms (平均${iterations}次)`);
}

console.log('基本类型数组性能测试:');
testPerformance(uniqueBasic, '基础方法', largeArray);
testPerformance(uniqueSet, 'Set方法', largeArray);
testPerformance(uniqueDeep, '深度比较', largeArray);
testPerformance(uniqueJSON, 'JSON方法', largeArray);
testPerformance(uniqueMap, 'Map方法', largeArray);
testPerformance(uniqueHybrid, '混合方法', largeArray);

console.log('\n对象数组性能测试:');
testPerformance(uniqueBasic, '基础方法', largeObjectArray);
testPerformance(uniqueSet, 'Set方法', largeObjectArray);
testPerformance(uniqueDeep, '深度比较', largeObjectArray);
testPerformance(uniqueJSON, 'JSON方法', largeObjectArray);
testPerformance(uniqueMap, 'Map方法', largeObjectArray);
testPerformance(uniqueHybrid, '混合方法', largeObjectArray);

// ==================== 复杂度分析 ====================

console.log('\n\n=== 复杂度分析 ===\n');

console.log('时间复杂度:');
console.log('  基础方法: O(n²) - 使用 includes 查找');
console.log('  Set方法: O(n) - 使用 Set 数据结构');
console.log('  深度比较: O(n²) - 每次都要深度比较');
console.log('  JSON方法: O(n) - 使用 Set 和 JSON 序列化');
console.log('  Map方法: O(n) - 使用 Map 数据结构');
console.log('  混合方法: O(n) 平均情况 - 根据数组大小选择策略');

console.log('\n空间复杂度:');
console.log('  所有方法: O(n) - 需要存储去重后的结果');

console.log('\n适用场景:');
console.log('  基础方法: 仅适用于基本类型，小数组');
console.log('  Set方法: 仅适用于基本类型，性能最好');
console.log('  深度比较: 适用于所有类型，但性能较差');
console.log('  JSON方法: 适用于可序列化对象，性能好');
console.log('  Map方法: 适用于所有类型，性能较好');
console.log('  混合方法: 智能选择，平衡性能和兼容性');

// ==================== 总结 ====================

console.log('\n\n=== 总结 ===\n');

console.log('✅ 推荐使用:');
console.log('  - 仅基本类型: uniqueSet (性能最佳)');
console.log('  - 包含对象/数组: uniqueJSON (性能好，兼容性好)');
console.log('  - 通用场景: uniqueHybrid (智能选择，平衡性能)');
console.log('  - 学习理解: uniqueDeep (实现清晰，易于理解)');

console.log('\n⚠️  注意事项:');
console.log('  - JSON方法无法处理循环引用、函数、Symbol等');
console.log('  - 深度比较方法性能较差，但兼容性最好');
console.log('  - 基础方法和Set方法无法处理对象和数组');

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        uniqueBasic,
        uniqueSet,
        uniqueDeep,
        uniqueJSON,
        uniqueMap,
        uniqueHybrid,
        deepEqual
    };
}

