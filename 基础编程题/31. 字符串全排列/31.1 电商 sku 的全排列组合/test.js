let names = ["iPhone X", "iPhone XS"]

let colors = ["黑色", "白色"]

let storages = ["64g", '128G', "256g"]

console.log(combine(names, colors, storages))

function combine(...args) {
    let res = [];

    function dfs(idx, track) {

        // 到达决策树底部
        if (idx === args.length) {
            res.push([...track])
            return
        }

        let chunk = args[idx]

        for (let item of chunk) {
            track.push(item)

            dfs(idx + 1, [...track])

            track.pop()
        }
    }

    dfs(0, [])

    return res
}