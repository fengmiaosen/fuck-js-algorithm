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

            track.push(num)

            dfs(track)

            track.pop()
        }
    }

    dfs([])

    return res
}


console.log(permute([1, 2, 3]))