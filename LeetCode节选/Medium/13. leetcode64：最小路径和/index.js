// 定一个包含非负整数的 m x n 网格 grid ，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。
// 说明：每次只能向下或者向右移动一步。

// 示例 1：

//  1 3 1
//  1 5 1
//  4 2 1
// 输入：grid = [[1,3,1],[1,5,1],[4,2,1]]
// 输出：7
// 解释：因为路径 1→3→1→1→1 的总和最小。
// 示例 2：

// 输入：grid = [[1,2,3],[4,5,6]]
// 输出：12
// 提示：

// m == grid.length
// n == grid[i].length
// 1 <= m, n <= 200
// 0 <= grid[i][j] <= 100

/**
 * 最小路径和，动态规划实现
 * @param {number[][]} grid 网格
 * @returns {number} 最小路径和
 */
function minPathSum(grid) {
    if (grid.length < 1 || grid[0].length < 1) {
        return 0
    }

    let m = grid.length
    let n = grid[0].length

    // 动态规划，dp[i][j] 表示从左上角到 (i, j) 位置的最小路径和
    let dp = new Array(m).fill(undefined).map(() => {
        return new Array(n).fill(0)
    })

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            // 左上角
            if (i === 0 && j === 0) {
                dp[0][0] = grid[0][0]
            } else if (i == 0 && j !== 0) {
                // 第一行
                dp[i][j] = dp[i][j - 1] + grid[i][j]
            } else if (i != 0 && j == 0) {
                // 第一列
                dp[i][j] = dp[i - 1][j] + grid[i][j]
            } else {
                dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j]
            }
        }
    }

    return dp[m - 1][n - 1]
}

console.log(minPathSum([[1, 3, 1], [1, 5, 1], [4, 2, 1]]))