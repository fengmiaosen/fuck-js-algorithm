// https://leetcode.cn/problems/shun-shi-zhen-da-yin-ju-zhen-lcof/
// https://leetcode.cn/problems/shun-shi-zhen-da-yin-ju-zhen-lcof/solution/shuang-ceng-you-ya-shi-xian-shun-shi-zhe-rfcw/


// 给定一个二维数组 array，请返回「螺旋遍历」该数组的结果。

// 螺旋遍历：从左上角开始，按照 向右、向下、向左、向上 的顺序 依次 提取元素，然后再进入内部一层重复相同的步骤，直到提取完所有元素。

 

// 示例 1：

// 输入：array = [[1,2,3],[8,9,4],[7,6,5]]
// 输出：[1,2,3,4,5,6,7,8,9]
// 示例 2：

// 输入：array  = [[1,2,3,4],[12,13,14,5],[11,16,15,6],[10,9,8,7]]
// 输出：[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
 

// 限制：

// 0 <= array.length <= 100
// 0 <= array[i].length <= 100
// 注意：本题与主站 54 题相同：https://leetcode-cn.com/problems/spiral-matrix/


var queryFn = function (matrix) {
    if (matrix.length === 0) return []

    let res = []
    let left = 0,
        right = matrix[0].length - 1,
        top = 0,
        bottom = matrix.length - 1

    while (true) {
        // 自左向右
        if (left > right) break
        // 当前行号 top边界不变，列号 i增加
        for (let i = left; i <= right; i++) {
            res.push(matrix[top][i])
        }
        // 当前行遍历结束，顶部边界行号（top）下移加1
        top++

        // 自上而下
        if (top > bottom) break
        // 当前列号 right 不变，行号i 增加
        for (let i = top; i <= bottom; i++) {
            res.push(matrix[i][right])
        }
        // 当前列遍历结束，右边界列号 right 左移减1
        right--

        // 自右向左
        if (left > right) break
        // 当前行号 bottom边界不变，列号i减小
        for (let i = right; i >= left; i--) {
            res.push(matrix[bottom][i])
        }
        // 当前行遍历结束，底部边界行号 bottom上移减1
        bottom--

        // 自下向上
        if (top > bottom) break
        // 当前列号 left左边界不变，行号 i 减小
        for (let i = bottom; i >= top; i--) {
            res.push(matrix[i][left])
        }
        // 当前列遍历结束，左侧边界列号 left 右移加1
        left++
    }
    return res
}

var matrix = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]

console.log(queryFn(matrix))
// [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]