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

console.log(getObjectDepth(caseExample)); // 输出: 3
console.log(getObjectDepth([{ a: 1 }, { b: 2 }])); // 输出: 3
console.log(getObjectDepth([2, [3, 4]])); // 输出: 3
