// https://leetcode.cn/problems/shun-shi-zhen-da-yin-ju-zhen-lcof/
// https://leetcode.cn/problems/shun-shi-zhen-da-yin-ju-zhen-lcof/solution/shuang-ceng-you-ya-shi-xian-shun-shi-zhe-rfcw/


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
        // 当前列号 left左边界不变，列号 i 减小
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