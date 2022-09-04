/**
 * 回溯法
 * @param  {...any} chunks 
 */
function combine(...chunks) {
    let res = []

    function dfs(idx, track) {
        const chunk = chunks[idx]

        for (let item of chunk) {
            // 选择
            track.push(item)

            // 到达决策树底部，结束递归
            if (idx === chunks.length - 1) {
                res.push([...track])
            } else {
                dfs(idx + 1, [...track])
            }

            // 撤销选择
            track.pop()
        }
    }

    dfs(0, [])

    return res
}


let names = ["iPhone X", "iPhone XS"]

let colors = ["黑色", "白色"]

let storages = ["64g", '128G', "256g"]

console.log(combine(names, colors, storages))