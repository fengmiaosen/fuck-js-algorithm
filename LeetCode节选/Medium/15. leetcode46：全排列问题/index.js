// 给定一个 没有重复 数字的序列，返回其所有可能的全排列。

// 示例:

// 输入: [1,2,3]
// 输出:
// [
//   [1,2,3],
//   [1,3,2],
//   [2,1,3],
//   [2,3,1],
//   [3,1,2],
//   [3,2,1]
// ]

/**
 * 回溯算法
 * 全排列问题
 * 给定一个 没有重复 数字的序列，返回其所有可能的全排列。
 * 
 * 回溯算法的框架：
 * result = []
 * def backtrack(路径, 选择列表):
 *     if 满足结束条件:
 *         result.add(路径)
 *         return
 * 
 *     for 选择 in 选择列表:
 *         做选择
 *         backtrack(路径, 选择列表)
 *         撤销选择
 * 
 * @param {number[]} nums 
 */
function permute(nums) {
    let res = []

    function dfs(track) {
        // 到达决策树底部
        if (track.length === nums.length) {
            res.push([...track])
            return
        }

        for (let num of nums) {
            // 剪枝操作，避免重复遍历
            if (track.includes(num)) {
                continue
            }

            // 做选择
            track.push(num)

            // 进入下一层决策树
            dfs(track)

            // 撤销选择
            track.pop()
        }
    }

    dfs([])

    return res
}


console.log(permute([1, 2, 3]))
console.log(permute([1, 2, 3, 4]))