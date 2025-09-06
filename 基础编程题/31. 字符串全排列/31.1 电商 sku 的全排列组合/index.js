let names = ["iPhone X", "iPhone XS"]

let colors = ["黑色", "白色"]

let storages = ["64g", '128G', "256g"]

console.log(combine(names, colors, storages))

function combine(...chunks) {
    let res = []

    function dfs(idx, track) {
        // 到达决策树底部
        if (idx === chunks.length) {
            res.push([...track])
            return
        }

        // 当前大类别
        let chunk = chunks[idx]

        // 大类中的具体项
        for (let item of chunk) {
            track.push(item)

            dfs(idx + 1, [...track])

            track.pop()
        }
    }

    dfs(0, [])

    return res
}