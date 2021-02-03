// 回溯法
// 解决一个回溯问题，实际上就是一个决策树的遍历过程。你只需要思考 3 个问题：
// 1、路径：也就是已经做出的选择。
// 2、选择列表：也就是你当前可以做的选择。
// 3、结束条件：也就是到达决策树底层，无法再做选择的条件。

// 在递归之前做出选择
// 在递归之后撤销刚才的选择
// 就能正确得到每个节点的选择列表和路径

function permutation(str) {
    let res = []

    // 追踪的路径
    let track = []

    dfs(str, track, res)

    return res
}

function dfs(str, track, res) {
    // 字符串中字符均递归过，到达决策树底部
    if (track.length === str.length) {
        res.push(track.join(''))
        return
    }

    for (const char of str) {
        // 已经在路径中的字符，跳过，执行剪枝操作
        if (track.includes(char)) {
            continue
        }

        // 做选择，修改路径
        track.push(char)

        // 继续递归
        dfs(str, track, res)

        // 撤销递归之前的选择
        track.pop()
    }
}

console.time('str')
console.dir(permutation('abcd'), { depth: null })
console.timeEnd('str')