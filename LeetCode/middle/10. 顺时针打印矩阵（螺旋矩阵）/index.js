// https://leetcode.cn/problems/shun-shi-zhen-da-yin-ju-zhen-lcof/
// https://leetcode.cn/problems/shun-shi-zhen-da-yin-ju-zhen-lcof/solution/shuang-ceng-you-ya-shi-xian-shun-shi-zhe-rfcw/


var queryFn = function (matrix) {
    if (matrix.length === 0) return []

    let res = []
    let left = 0,
        right = matrix[0].length - 1,
        top = 0,
        bottom = matrix.length - 1

    let n = matrix[0].length * matrix.length

    while (true) {
        // 自左向右
        if (left > right) break
        for (let i = left; i <= right; i++) {
            res.push(matrix[top][i])
        }
        top++

        // 自上而下
        if (top > bottom) break
        for (let i = top; i <= bottom; i++) {
            res.push(matrix[i][right])
        }
        right--

        // 自右向左
        if (left > right) break
        for (let i = right; i >= left; i--) {
            res.push(matrix[bottom][i])
        }
        bottom--

        // 自下向上
        if (top > bottom) break
        for (let i = bottom; i >= top; i--) {
            res.push(matrix[i][left])
        }
        left++
    }
    return res
}

var matrix = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]

console.log(queryFn(matrix))
// [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]