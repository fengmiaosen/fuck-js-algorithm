
/**
 * 
 * @param {number[][]} matrix 
 */
function queryFn(matrix) {
    if (matrix.length < 1 || matrix[0].length < 1) {
        return []
    }

    let res = []
    let m = matrix.length
    let n = matrix[0].length

    // 矩阵四个边界，行号、列号
    let top = 0
    let right = n - 1
    let bottom = m - 1
    let left = 0

    while (true) {
        if (right < left) {
            break;
        }
        // 顶部自左向右
        for (let i = left; i <= right; i++) {
            res.push(matrix[top][i])

        }
        top++

        if (top > bottom) {
            break;
        }
        // 右侧自上而下
        for (let i = top; i <= bottom; i++) {
            res.push(matrix[i][right])
        }
        right--

        if (right < left) {
            break;
        }
        // 底部自右向左
        for (let i = right; i >= left; i--) {
            res.push(matrix[bottom][i])
        }
        bottom--

        if (top > bottom) {
            break;
        }
        // 左边界自下而上
        for (let i = bottom; i >= top; i--) {
            res.push(matrix[i][left])
        }
        left++

    }

    return res
}


var matrix = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]

console.log(queryFn(matrix))