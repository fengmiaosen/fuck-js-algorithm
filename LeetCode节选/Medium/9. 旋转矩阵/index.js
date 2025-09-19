// 给你一幅由 N × N 矩阵表示的图像，其中每个像素的大小为 4 字节。请你设计一种算法，将图像旋转 90 度。

// 不占用额外内存空间能否做到？

// 示例 1:

// 给定 matrix = 
// [
//   [1,2,3],
//   [4,5,6],
//   [7,8,9]
// ],

// 原地旋转输入矩阵，使其变为:
// [
//   [7,4,1],
//   [8,5,2],
//   [9,6,3]
// ]
// 示例 2:

// 给定 matrix =
// [
//   [ 5, 1, 9,11],
//   [ 2, 4, 8,10],
//   [13, 3, 6, 7],
//   [15,14,12,16]
// ], 

// 原地旋转输入矩阵，使其变为:
// [
//   [15,13, 2, 5],
//   [14, 3, 4, 1],
//   [12, 6, 8, 9],
//   [16, 7,10,11]
// ]

/**
 * 方法1: 原地旋转解法（转置 + 翻转）
 * 时间复杂度: O(n²) - 需要遍历矩阵两次
 * 空间复杂度: O(1) - 原地操作，不使用额外空间
 * 
 * 思路：将90度顺时针旋转分解为两个步骤：
 * 1. 先沿主对角线转置矩阵
 * 2. 再沿垂直中轴线翻转每一行
 * 
 * 数学原理：
 * 原始位置 (i,j) -> 转置后 (j,i) -> 翻转后 (j, n-1-i)
 * 这正好是90度顺时针旋转的目标位置
 * 
 * @param {number[][]} matrix - 输入的n×n矩阵
 */
function rotateTranspose(matrix) {
    if (!matrix || matrix.length === 0 || matrix.length !== matrix[0].length) {
        return;
    }
    
    const n = matrix.length;
    
    // 步骤1: 沿主对角线转置矩阵
    // 只需要处理上三角部分，避免重复交换
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            // 交换 matrix[i][j] 和 matrix[j][i]
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }
    
    // 步骤2: 翻转每一行（沿垂直中轴线）
    for (let i = 0; i < n; i++) {
        let left = 0, right = n - 1;
        while (left < right) {
            // 交换 matrix[i][left] 和 matrix[i][right]
            [matrix[i][left], matrix[i][right]] = [matrix[i][right], matrix[i][left]];
            left++;
            right--;
        }
    }
}

/**
 * 方法2: 四元组循环解法
 * 时间复杂度: O(n²) - 每个元素只访问一次
 * 空间复杂度: O(1) - 原地操作，不使用额外空间
 * 
 * 思路：将矩阵分为若干个同心正方形环，对每个环进行旋转
 * 每次同时处理四个位置的元素，形成一个循环
 * 
 * 位置映射关系：
 * (i,j) -> (j, n-1-i) -> (n-1-i, n-1-j) -> (n-1-j, i) -> (i,j)
 * 
 * @param {number[][]} matrix - 输入的n×n矩阵
 */
function rotateFourWay(matrix) {
    if (!matrix || matrix.length === 0 || matrix.length !== matrix[0].length) {
        return;
    }
    
    const n = matrix.length;
    
    // 处理每一层（同心正方形环）
    for (let layer = 0; layer < Math.floor(n / 2); layer++) {
        const first = layer;
        const last = n - 1 - layer;
        
        // 处理当前层的每个位置
        for (let i = first; i < last; i++) {
            const offset = i - first;
            
            // 保存左上角元素
            const top = matrix[first][i];
            
            // 左上角 <- 左下角
            matrix[first][i] = matrix[last - offset][first];
            
            // 左下角 <- 右下角
            matrix[last - offset][first] = matrix[last][last - offset];
            
            // 右下角 <- 右上角
            matrix[last][last - offset] = matrix[i][last];
            
            // 右上角 <- 左上角（保存的值）
            matrix[i][last] = top;
        }
    }
}

/**
 * 方法3: 分层旋转解法（递归版本）
 * 时间复杂度: O(n²) - 每个元素只访问一次
 * 空间复杂度: O(log n) - 递归调用栈的深度
 * 
 * 思路：递归地处理每一层，从外层到内层
 * 每层独立旋转，直到处理完所有层
 * 
 * @param {number[][]} matrix - 输入的n×n矩阵
 */
function rotateLayered(matrix) {
    if (!matrix || matrix.length === 0 || matrix.length !== matrix[0].length) {
        return;
    }
    
    const n = matrix.length;
    
    function rotateLayer(start, end) {
        if (start >= end) return;
        
        // 旋转当前层的边界
        for (let i = start; i < end; i++) {
            const offset = i - start;
            
            // 保存顶边元素
            const temp = matrix[start][i];
            
            // 顶边 <- 左边
            matrix[start][i] = matrix[end - offset][start];
            
            // 左边 <- 底边
            matrix[end - offset][start] = matrix[end][end - offset];
            
            // 底边 <- 右边
            matrix[end][end - offset] = matrix[i][end];
            
            // 右边 <- 顶边（保存的值）
            matrix[i][end] = temp;
        }
        
        // 递归处理内层
        rotateLayer(start + 1, end - 1);
    }
    
    rotateLayer(0, n - 1);
}

/**
 * 方法4: 数学公式直接映射解法
 * 时间复杂度: O(n²) - 需要创建新矩阵并复制回原矩阵
 * 空间复杂度: O(n²) - 需要额外的矩阵空间
 * 
 * 思路：直接使用数学公式计算每个元素旋转后的位置
 * 虽然使用了额外空间，但逻辑最清晰
 * 
 * @param {number[][]} matrix - 输入的n×n矩阵
 */
function rotateFormula(matrix) {
    if (!matrix || matrix.length === 0 || matrix.length !== matrix[0].length) {
        return;
    }
    
    const n = matrix.length;
    const rotated = Array(n).fill().map(() => Array(n));
    
    // 使用公式：(i,j) -> (j, n-1-i)
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            rotated[j][n - 1 - i] = matrix[i][j];
        }
    }
    
    // 将结果复制回原矩阵
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            matrix[i][j] = rotated[i][j];
        }
    }
}

// 原始函数保持兼容性，使用最优解法
function rotate(matrix) {
    rotateTranspose(matrix);
}

// ==================== 测试用例 ====================

console.log('=== 矩阵旋转问题测试 ===\n');

// 测试数据
const testCases = [
    {
        name: '示例1: 3×3矩阵',
        matrix: [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ],
        expected: [
            [7, 4, 1],
            [8, 5, 2],
            [9, 6, 3]
        ]
    },
    {
        name: '示例2: 4×4矩阵',
        matrix: [
            [5, 1, 9, 11],
            [2, 4, 8, 10],
            [13, 3, 6, 7],
            [15, 14, 12, 16]
        ],
        expected: [
            [15, 13, 2, 5],
            [14, 3, 4, 1],
            [12, 6, 8, 9],
            [16, 7, 10, 11]
        ]
    },
    {
        name: '示例3: 1×1矩阵',
        matrix: [[1]],
        expected: [[1]]
    },
    {
        name: '示例4: 2×2矩阵',
        matrix: [
            [1, 2],
            [3, 4]
        ],
        expected: [
            [3, 1],
            [4, 2]
        ]
    },
    {
        name: '示例5: 5×5矩阵',
        matrix: [
            [1, 2, 3, 4, 5],
            [6, 7, 8, 9, 10],
            [11, 12, 13, 14, 15],
            [16, 17, 18, 19, 20],
            [21, 22, 23, 24, 25]
        ],
        expected: [
            [21, 16, 11, 6, 1],
            [22, 17, 12, 7, 2],
            [23, 18, 13, 8, 3],
            [24, 19, 14, 9, 4],
            [25, 20, 15, 10, 5]
        ]
    },
    {
        name: '示例6: 负数矩阵',
        matrix: [
            [-1, -2],
            [-3, -4]
        ],
        expected: [
            [-3, -1],
            [-4, -2]
        ]
    }
];

// 测试所有实现方法
const methods = [
    { name: '转置翻转解法', func: rotateTranspose },
    { name: '四元组循环解法', func: rotateFourWay },
    { name: '分层旋转解法', func: rotateLayered },
    { name: '数学公式解法', func: rotateFormula }
];

// 深度复制矩阵的辅助函数
function deepCopyMatrix(matrix) {
    return matrix.map(row => [...row]);
}

// 比较两个矩阵是否相等
function matricesEqual(matrix1, matrix2) {
    if (matrix1.length !== matrix2.length) return false;
    for (let i = 0; i < matrix1.length; i++) {
        if (matrix1[i].length !== matrix2[i].length) return false;
        for (let j = 0; j < matrix1[i].length; j++) {
            if (matrix1[i][j] !== matrix2[i][j]) return false;
        }
    }
    return true;
}

// 运行功能测试
methods.forEach(method => {
    console.log(`--- ${method.name} ---`);
    let passCount = 0;
    
    testCases.forEach(testCase => {
        try {
            const matrix = deepCopyMatrix(testCase.matrix);
            method.func(matrix);
            const passed = matricesEqual(matrix, testCase.expected);
            
            console.log(`${testCase.name}: ${passed ? '✅ 通过' : '❌ 失败'}`);
            if (!passed) {
                console.log(`  期望:`);
                testCase.expected.forEach(row => console.log(`    [${row.join(', ')}]`));
                console.log(`  实际:`);
                matrix.forEach(row => console.log(`    [${row.join(', ')}]`));
            }
            
            if (passed) passCount++;
        } catch (error) {
            console.log(`${testCase.name}: ❌ 错误 - ${error.message}`);
        }
    });
    
    console.log(`通过率: ${passCount}/${testCases.length}\n`);
});

// ==================== 边界情况测试 ====================

console.log('=== 边界情况测试 ===\n');

const edgeCases = [
    { name: '空矩阵', matrix: [], expected: [] },
    { name: '非方阵', matrix: [[1, 2, 3], [4, 5, 6]], expected: [[1, 2, 3], [4, 5, 6]] },
    { name: 'null输入', matrix: null, expected: null },
    { name: '大数值矩阵', matrix: [[2147483647, -2147483648], [1000000, -1000000]], expected: [[1000000, 2147483647], [-1000000, -2147483648]] }
];

edgeCases.forEach(testCase => {
    console.log(`${testCase.name}:`);
    methods.forEach(method => {
        try {
            const matrix = testCase.matrix ? deepCopyMatrix(testCase.matrix) : testCase.matrix;
            method.func(matrix);
            
            let passed;
            if (testCase.matrix === null) {
                passed = matrix === null;
            } else if (testCase.matrix.length === 0) {
                passed = matrix.length === 0;
            } else {
                passed = matricesEqual(matrix, testCase.expected);
            }
            
            console.log(`  ${method.name}: ${passed ? '✅' : '❌'}`);
            if (!passed && matrix) {
                console.log(`    实际: ${JSON.stringify(matrix)}`);
            }
        } catch (error) {
            console.log(`  ${method.name}: ❌ 错误 - ${error.message}`);
        }
    });
    console.log();
});

// ==================== 性能测试 ====================

console.log('=== 性能测试 ===\n');

function performanceTest() {
    // 测试不同规模的矩阵
    const sizes = [10, 50, 100, 200];
    
    sizes.forEach(size => {
        console.log(`矩阵大小: ${size}×${size}`);
        
        // 生成随机测试矩阵
        const matrix = Array(size).fill().map((_, i) => 
            Array(size).fill().map((_, j) => i * size + j)
        );
        
        methods.forEach(method => {
            const testMatrix = deepCopyMatrix(matrix);
            const startTime = performance.now();
            
            // 运行多次取平均值
            const iterations = size <= 50 ? 1000 : size <= 100 ? 100 : 10;
            for (let i = 0; i < iterations; i++) {
                const copyMatrix = deepCopyMatrix(matrix);
                method.func(copyMatrix);
            }
            
            const endTime = performance.now();
            const avgTime = (endTime - startTime) / iterations;
            
            console.log(`  ${method.name}: ${avgTime.toFixed(3)}ms`);
        });
        
        console.log();
    });
}

performanceTest();

// ==================== 算法正确性验证 ====================

console.log('=== 算法正确性验证 ===\n');

function verifyConsistency() {
    const testData = [
        [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ],
        [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 15, 16]
        ]
    ];
    
    testData.forEach((matrix, index) => {
        console.log(`验证测试 ${index + 1}: ${matrix.length}×${matrix.length}矩阵`);
        
        const results = methods.map(method => {
            const testMatrix = deepCopyMatrix(matrix);
            method.func(testMatrix);
            return {
                name: method.name,
                result: testMatrix
            };
        });
        
        // 检查所有方法的结果是否一致
        const firstResult = results[0].result;
        const allConsistent = results.every(r => matricesEqual(r.result, firstResult));
        
        console.log(`结果一致性: ${allConsistent ? '✅ 所有算法结果一致' : '❌ 算法结果不一致'}`);
        
        if (!allConsistent) {
            results.forEach(r => {
                console.log(`  ${r.name}:`);
                r.result.forEach(row => console.log(`    [${row.join(', ')}]`));
            });
        } else {
            console.log(`  统一结果:`);
            firstResult.forEach(row => console.log(`    [${row.join(', ')}]`));
        }
        
        console.log();
    });
}

verifyConsistency();

// ==================== 旋转次数测试 ====================

console.log('=== 旋转次数测试 ===\n');

function testMultipleRotations() {
    const originalMatrix = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ];
    
    console.log('原始矩阵:');
    originalMatrix.forEach(row => console.log(`  [${row.join(', ')}]`));
    console.log();
    
    let matrix = deepCopyMatrix(originalMatrix);
    
    for (let i = 1; i <= 4; i++) {
        rotateTranspose(matrix);
        console.log(`旋转 ${i} 次后:`);
        matrix.forEach(row => console.log(`  [${row.join(', ')}]`));
        
        if (i === 4) {
            const backToOriginal = matricesEqual(matrix, originalMatrix);
            console.log(`是否回到原始状态: ${backToOriginal ? '✅ 是' : '❌ 否'}`);
        }
        console.log();
    }
}

testMultipleRotations();

// ==================== 模块导出 ====================

module.exports = {
    rotate,
    rotateTranspose,
    rotateFourWay,
    rotateLayered,
    rotateFormula
};