// 计算对象层级深度

// [], {} => 1
// [1], { a: 4 } => 2
// undefined, 1, "1" => 1
// [{ a: 1 }, { b: 2 }] => 3
// [2, [3, 4]] => 3

function getObjectDepth(obj) {
    if (obj === null || typeof obj !== 'object') {
        return 0;
    }

    let maxDepth = 0;
    for (const key in obj) {
        const depth = getObjectDepth(obj[key]);
        maxDepth = Math.max(maxDepth, depth);
    }

    return maxDepth + 1; // 加1计算当前层级
}

// 示例用法
const caseExample = {
    level1: {
        level2: {
            level3: {}
        }
    },
    level1_2: {}
};

// 非递归实现 - 使用栈的方式
function getObjectDepthIterative(obj) {
    if (obj === null || typeof obj !== 'object') {
        return 0;
    }

    // 使用栈来存储 [对象, 当前深度] 的元组
    const stack = [[obj, 1]];
    let maxDepth = 1;

    while (stack.length > 0) {
        const [currentObj, currentDepth] = stack.pop();
        maxDepth = Math.max(maxDepth, currentDepth);

        // 遍历当前对象的所有属性
        for (const key in currentObj) {
            const value = currentObj[key];
            // 如果值是对象或数组，将其加入栈中，深度+1
            if (value !== null && typeof value === 'object') {
                stack.push([value, currentDepth + 1]);
            }
        }
    }

    return maxDepth;
}

// 非递归实现 - 使用队列的方式（层序遍历）
function getObjectDepthBFS(obj) {
    if (obj === null || typeof obj !== 'object') {
        return 0;
    }

    // 使用队列来存储当前层的所有对象
    let queue = [obj];
    let depth = 0;

    while (queue.length > 0) {
        depth++;
        const nextQueue = [];
        
        // 处理当前层的所有对象
        for (const currentObj of queue) {
            for (const key in currentObj) {
                const value = currentObj[key];
                // 如果值是对象或数组，将其加入下一层队列
                if (value !== null && typeof value === 'object') {
                    nextQueue.push(value);
                }
            }
        }
        
        queue = nextQueue;
    }

    return depth;
}

// 测试用例
console.log('=== 递归版本测试 ===');
console.log('caseExample:', getObjectDepth(caseExample)); // 应该是 4
console.log('[{ a: 1 }, { b: 2 }]:', getObjectDepth([{ a: 1 }, { b: 2 }])); // 应该是 2
console.log('[2, [3, 4]]:', getObjectDepth([2, [3, 4]])); // 应该是 2
console.log('[]:', getObjectDepth([])); // 应该是 1
console.log('{}:', getObjectDepth({})); // 应该是 1
console.log('undefined:', getObjectDepth(undefined)); // 应该是 0
console.log('1:', getObjectDepth(1)); // 应该是 0
console.log('"string":', getObjectDepth("string")); // 应该是 0

console.log('\n=== 非递归版本（栈）测试 ===');
console.log('caseExample:', getObjectDepthIterative(caseExample)); // 应该是 4
console.log('[{ a: 1 }, { b: 2 }]:', getObjectDepthIterative([{ a: 1 }, { b: 2 }])); // 应该是 2
console.log('[2, [3, 4]]:', getObjectDepthIterative([2, [3, 4]])); // 应该是 2
console.log('[]:', getObjectDepthIterative([])); // 应该是 1
console.log('{}:', getObjectDepthIterative({})); // 应该是 1
console.log('undefined:', getObjectDepthIterative(undefined)); // 应该是 0
console.log('1:', getObjectDepthIterative(1)); // 应该是 0
console.log('"string":', getObjectDepthIterative("string")); // 应该是 0

console.log('\n=== 非递归版本（队列/BFS）测试 ===');
console.log('caseExample:', getObjectDepthBFS(caseExample)); // 应该是 4
console.log('[{ a: 1 }, { b: 2 }]:', getObjectDepthBFS([{ a: 1 }, { b: 2 }])); // 应该是 2
console.log('[2, [3, 4]]:', getObjectDepthBFS([2, [3, 4]])); // 应该是 2
console.log('[]:', getObjectDepthBFS([])); // 应该是 1
console.log('{}:', getObjectDepthBFS({})); // 应该是 1
console.log('undefined:', getObjectDepthBFS(undefined)); // 应该是 0
console.log('1:', getObjectDepthBFS(1)); // 应该是 0
console.log('"string":', getObjectDepthBFS("string")); // 应该是 0

// 复杂测试用例
const complexObj = {
    a: {
        b: {
            c: {
                d: {
                    e: 'deep'
                }
            }
        }
    },
    f: [1, [2, [3, [4, 5]]]],
    g: 'simple'
};

console.log('\n=== 复杂对象测试 ===');
console.log('递归版本:', getObjectDepth(complexObj));
console.log('非递归版本（栈）:', getObjectDepthIterative(complexObj));
console.log('非递归版本（队列）:', getObjectDepthBFS(complexObj));
