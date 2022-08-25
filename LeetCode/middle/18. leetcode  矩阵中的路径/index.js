// 给定一个 m x n 二维字符网格 board 和一个字符串单词 word 。如果 word 存在于网格中，返回 true ；否则，返回 false 。

// 单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。

//  

// 例如，在下面的 3×4 的矩阵中包含单词 "ABCCED"（单词中的字母已标出）。

// 作者：Krahets
// 链接：https://leetcode.cn/leetbook/read/illustration-of-algorithm/58wowd/
// 来源：力扣（LeetCode）
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

// 示例 1：

// 输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
// 输出：true
// 示例 2：

// 输入：board = [["a","b"],["c","d"]], word = "abcd"
// 输出：false

/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function (board, word) {
    if (board.length < 1 || board[0].length < 1) {
        return false
    }


    let m = board.length
    let n = board[0].length

    // 定义同样大小的二维数组（矩阵），用来标识对应矩阵的访问状态
    let matrix = new Array(m).fill([]).map(() => {
        return new Array(n).fill(0)
    })

    let dxy = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ]

    /**
     * 
     * @param {number} i 
     * @param {number} j 
     * @param {number} idx 
     * @returns 
     */
    function dfs(i, j, idx) {
        // 注意递归结束条件
        // 当已经匹配到单词最后一个位置，判断下当前字母是否与单词最后字母一致
        if (idx === word.length - 1) {
            return board[i][j] === word[idx]
        }

        // 当前矩阵元素为单词中字符
        if (board[i][j] === word[idx]) {
            // 以当前元素为中心，开始递归搜索，将其设为已访问状态，递归结束再回溯
            matrix[i][j] = 1

            // 四个方向递归遍历，直到满足条件退出，否则继续搜索
            for (let xy of dxy) {
                const [dx, dy] = xy
                const x = i + dx
                const y = j + dy
                if (x >= 0 && x < m && y >= 0 && y < n && !matrix[x][y]) {
                    if (dfs(x, y, idx + 1)) {
                        return true
                    }
                }
            }

            // 四个方向寻找后都没有结果，进行回溯操作，标记为未访问状态
            matrix[i][j] = 0
        }
    }


    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (dfs(i, j, 0)) {
                return true
            }
        }
    }

    return false
};

let board = [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], word = "ABCCED"

console.log(exist(board, word))