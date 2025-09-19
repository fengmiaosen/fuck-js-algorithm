
// 以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回 一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间 。

//  

// 示例 1：

// 输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
// 输出：[[1,6],[8,10],[15,18]]
// 解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].
// 示例 2：

// 输入：intervals = [[1,4],[4,5]]
// 输出：[[1,5]]
// 解释：区间 [1,4] 和 [4,5] 可被视为重叠区间。
//  

// 提示：

// 1 <= intervals.length <= 104
// intervals[i].length == 2
// 0 <= starti <= endi <= 104

// 来源：力扣（LeetCode）
// 链接：https://leetcode.cn/problems/merge-intervals
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function (intervals) {
    // 按照各个子区间的左边界排序，便于后续合并区间
    intervals.sort((a, b) => a[0] - b[0])

    // 两两比较是否有交叉
    let res = [intervals[0]]
    // 结果数组对应子区间的索引号
    let idx = 0

    for (let i = 1; i < intervals.length; i++) {
        // 相邻区间有交叉，直接更新设置当前结果数组子区间的有边界即可
        if (intervals[i][0] < res[idx][1]) {
            res[idx][1] = Math.max(intervals[i][1], res[idx][1])
        } else {
            // 没有交叉，则追加到结果数组中
            res[++idx] = intervals[i]
        }
    }

    return res

};

console.log(merge([[1, 3], [2, 6], [8, 10], [15, 18]]))