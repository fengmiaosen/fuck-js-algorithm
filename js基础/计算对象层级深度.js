// [], {} => 1
// [1], { a: 4 } => 2
// undefined, 1, "1" => 1
// [{ a: 1 }, { b: 2 }] => 3
// [2, [3, 4]] => 3

function getObjectDepth(obj) {
    // Fix: Return 1 for primitive values (including null) as per comments
    if (obj === null || typeof obj !== 'object') {
        return 1;
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

console.log(getObjectDepth(caseExample));
console.log(getObjectDepth([{ a: 1 }, { b: 2 }]));
console.log(getObjectDepth([2, [3, 4]]));
// Test primitive values
console.log(getObjectDepth(1)); // Should output 1
console.log(getObjectDepth("test")); // Should output 1
console.log(getObjectDepth(null)); // Should output 1
