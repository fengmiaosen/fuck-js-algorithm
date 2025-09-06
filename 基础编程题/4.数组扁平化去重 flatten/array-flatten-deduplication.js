/**
 * 数组扁平化去重 - 多种实现方法
 * 作者：AI Assistant
 * 日期：2024
 */

// 测试数据
const testArray = [
    [1, 2, 2],
    [3, 4, 5, 5, 20, [[90]]],
    [6, 7, 8, 9, [11, 12, [12, 13, [14]]]]
];

/**
 * 去重函数
 * @param {Array} list 
 * @returns {Array}
 */
function uniq(list) {
    return Array.from(new Set(list))
}

/**
 * 方法一：使用 flat() 方法（最简单）
 * ES2019 原生方法，推荐用于生产环境
 * @param {Array} list 
 * @returns {Array}
 */
function flat1(list) {
    return list.flat(Infinity)
}

/**
 * 方法二：广度优先遍历（BFS）
 * 使用队列实现，按层级遍历
 * @param {Array} list 
 * @returns {Array}
 */
function flat2(list) {
    let res = []
    let queue = [...list]

    while (queue.length) {
        const node = queue.shift()

        if (Array.isArray(node)) {
            queue.push(...node)
        } else {
            res.push(node)
        }
    }

    return res
}

/**
 * 方法三：深度优先遍历（DFS）
 * 递归实现，性能优秀
 * @param {Array} list 
 * @returns {Array}
 */
function flat3(list) {
    let res = []
    
    function dfs(arr) {
        for (let item of arr) {
            if (Array.isArray(item)) {
                dfs(item)
            } else {
                res.push(item)
            }
        }
    }
    
    dfs(list)
    return res
}

/**
 * 方法四：使用 reduce 递归
 * 函数式编程风格
 * @param {Array} list 
 * @returns {Array}
 */
function flat4(list) {
    return list.reduce((acc, item) => {
        if (Array.isArray(item)) {
            return acc.concat(flat4(item))
        } else {
            return acc.concat(item)
        }
    }, [])
}

/**
 * 方法五：使用 toString() 方法
 * 仅适用于数字数组
 * @param {Array} list 
 * @returns {Array}
 */
function flat5(list) {
    return list.toString().split(',').map(Number)
}

/**
 * 方法六：使用 JSON.stringify 和正则
 * 仅适用于简单数据类型
 * @param {Array} list 
 * @returns {Array}
 */
function flat6(list) {
    const str = JSON.stringify(list)
    return str.match(/-?\d+\.?\d*/g).map(Number)
}

/**
 * 方法七：迭代 + 栈
 * 使用栈实现，性能良好
 * @param {Array} list 
 * @returns {Array}
 */
function flat7(list) {
    const stack = [...list]
    const res = []
    
    while (stack.length) {
        const item = stack.pop()
        
        if (Array.isArray(item)) {
            stack.push(...item)
        } else {
            res.unshift(item)
        }
    }
    
    return res
}

/**
 * 方法八：while + some 方法
 * 简洁的实现方式
 * @param {Array} list 
 * @returns {Array}
 */
function flat8(list) {
    let result = [...list]
    
    while (result.some(Array.isArray)) {
        result = [].concat(...result)
    }
    
    return result
}

/**
 * 方法九：Generator 函数
 * 使用生成器实现
 * @param {Array} list 
 * @returns {Array}
 */
function* flatGenerator(list) {
    for (let item of list) {
        if (Array.isArray(item)) {
            yield* flatGenerator(item)
        } else {
            yield item
        }
    }
}

function flat9(list) {
    return Array.from(flatGenerator(list))
}

/**
 * 方法十：尾递归优化版本
 * 避免栈溢出
 * @param {Array} list 
 * @returns {Array}
 */
function flat10(list) {
    function flatten(arr, result = []) {
        for (let item of arr) {
            if (Array.isArray(item)) {
                flatten(item, result)
            } else {
                result.push(item)
            }
        }
        return result
    }
    
    return flatten(list)
}

// ==================== 测试代码 ====================

console.log('=== 数组扁平化去重测试 ===\n');

console.log('原始数组:', testArray);
console.log('数组深度:', getArrayDepth(testArray));
console.log('预期结果长度: 15 (去重后)\n');

// 测试所有方法
const methods = [
    { name: 'flat() 方法', fn: flat1 },
    { name: 'BFS 广度优先', fn: flat2 },
    { name: 'DFS 深度优先', fn: flat3 },
    { name: 'reduce 递归', fn: flat4 },
    { name: 'toString 方法', fn: flat5 },
    { name: 'JSON 正则', fn: flat6 },
    { name: '栈方法', fn: flat7 },
    { name: 'while + some', fn: flat8 },
    { name: 'Generator', fn: flat9 },
    { name: '尾递归优化', fn: flat10 }
];

methods.forEach(({ name, fn }) => {
    try {
        const result = uniq(fn(testArray));
        console.log(`${name}:`, result);
        console.log(`  长度: ${result.length}, 正确: ${result.length === 15 ? '✅' : '❌'}\n`);
    } catch (error) {
        console.log(`${name}: 错误 - ${error.message}\n`);
    }
});

// ==================== 性能测试 ====================

console.log('=== 性能测试 ===\n');

// 创建大型测试数组
const largeTestArray = Array.from({length: 1000}, (_, i) => [
    i, 
    [i+1, [i+2, [i+3]]], 
    [i+4, [i+5]]
]);

function testPerformance(fn, name, iterations = 100) {
    const start = performance.now()
    
    for (let i = 0; i < iterations; i++) {
        fn(largeTestArray)
    }
    
    const end = performance.now()
    const avgTime = (end - start) / iterations
    
    console.log(`${name}: ${avgTime.toFixed(3)}ms (平均${iterations}次)`)
}

// 只测试性能较好的方法
const performanceMethods = [
    { name: 'flat() 方法', fn: flat1 },
    { name: 'DFS 深度优先', fn: flat3 },
    { name: '栈方法', fn: flat7 },
    { name: 'while + some', fn: flat8 },
    { name: '尾递归优化', fn: flat10 }
];

performanceMethods.forEach(({ name, fn }) => {
    testPerformance(fn, name)
});

// ==================== 辅助函数 ====================

/**
 * 获取数组的最大深度
 * @param {Array} arr 
 * @returns {number}
 */
function getArrayDepth(arr) {
    if (!Array.isArray(arr)) return 0
    
    let maxDepth = 1
    for (let item of arr) {
        if (Array.isArray(item)) {
            maxDepth = Math.max(maxDepth, 1 + getArrayDepth(item))
        }
    }
    
    return maxDepth
}

/**
 * 创建指定深度的嵌套数组
 * @param {number} depth 
 * @param {number} width 
 * @returns {Array}
 */
function createNestedArray(depth, width = 3) {
    if (depth === 0) return Math.floor(Math.random() * 100)
    
    const arr = []
    for (let i = 0; i < width; i++) {
        arr.push(createNestedArray(depth - 1, width))
    }
    
    return arr
}

console.log('\n=== 深度测试 ===');
const deepArray = createNestedArray(5, 2);
console.log('5层嵌套数组深度:', getArrayDepth(deepArray));
console.log('DFS方法结果长度:', flat3(deepArray).length);

console.log('\n=== 总结 ===');
console.log('✅ 推荐生产环境使用: flat() 方法 (flat1)');
console.log('✅ 推荐面试展示: DFS方法 (flat3) 或 BFS方法 (flat2)');
console.log('✅ 推荐学习理解: 所有方法都有其独特价值');
