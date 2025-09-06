/**
 * 小美的排列询问
 * 判断排列中两个数字是否相邻
 */

/**
 * 判断排列中x和y是否相邻
 * @param {number[]} arr - 排列数组
 * @param {number} x - 第一个数字
 * @param {number} y - 第二个数字
 * @returns {boolean} 是否相邻
 */
function isAdjacent(arr, x, y) {
    // 找到x和y在数组中的位置
    let xIndex = -1;
    let yIndex = -1;
    
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === x) {
            xIndex = i;
        }
        if (arr[i] === y) {
            yIndex = i;
        }
    }
    
    // 如果找不到x或y，返回false
    if (xIndex === -1 || yIndex === -1) {
        return false;
    }
    
    // 判断位置差的绝对值是否为1
    return Math.abs(xIndex - yIndex) === 1;
}

/**
 * 处理输入并输出结果
 * @param {number} n - 排列长度
 * @param {number[]} arr - 排列数组
 * @param {number} x - 第一个数字
 * @param {number} y - 第二个数字
 */
function solve(n, arr, x, y) {
    const result = isAdjacent(arr, x, y);
    return result ? "Yes" : "No";
}

// 测试示例
console.log("示例1测试:");
console.log("输入: n=4, arr=[1,2,3,4], x=3, y=2");
console.log("输出:", solve(4, [1, 2, 3, 4], 3, 2)); // No

console.log("\n示例2测试:");
console.log("输入: n=4, arr=[1,3,2,4], x=3, y=2");
console.log("输出:", solve(4, [1, 3, 2, 4], 3, 2)); // Yes

// 更多测试用例
console.log("\n额外测试:");
console.log("测试1: arr=[1,2,3,4,5], x=1, y=2");
console.log("输出:", solve(5, [1, 2, 3, 4, 5], 1, 2)); // Yes

console.log("测试2: arr=[5,4,3,2,1], x=5, y=1");
console.log("输出:", solve(5, [5, 4, 3, 2, 1], 5, 1)); // No

console.log("测试3: arr=[1,3,5,2,4], x=5, y=2");
console.log("输出:", solve(5, [1, 3, 5, 2, 4], 5, 2)); // Yes

// 交互式输入处理函数
function processInput() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    let lineCount = 0;
    let n, arr, x, y;
    
    rl.on('line', (line) => {
        lineCount++;
        
        if (lineCount === 1) {
            n = parseInt(line.trim());
        } else if (lineCount === 2) {
            arr = line.trim().split(' ').map(Number);
        } else if (lineCount === 3) {
            x = parseInt(line.trim());
        } else if (lineCount === 4) {
            y = parseInt(line.trim());
            console.log(solve(n, arr, x, y));
            rl.close();
        }
    });
}

// 如果直接运行此文件，启动交互式输入
if (require.main === module) {
    processInput();
}

module.exports = { isAdjacent, solve };
