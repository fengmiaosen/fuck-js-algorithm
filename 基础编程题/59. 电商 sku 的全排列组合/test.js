
let names = ["iPhone 12", "iPhone 12 Pro"]

let colors = ["黑色", "白色"]

let storages = ["64g", '128G', "256g"]

console.log(combine(names, colors, storages))

function combine(...chunks) {
    // chunks 二维数组
    // [
    //     ["iPhone 12", "iPhone 12 Pro"],
    //     ["黑色", "白色"],
    //     ["64g", '128G', "256g"]
    // ]

    let res = []

    // idx 二维数组的层次
    // track 已记录的路径数组（sku组合）
    function dfs(idx, track) {
        // 一级类目遍历结束，到达决策树底部
        if (idx === chunks.length) {
            res.push(...track);
            return;
        }

        // 类目数组（name、color、storage）
        const chunk = chunks[idx]

        // 类目数据项
        for (let item of chunk) {
            track.push(item)

            dfs(idx + 1, [...track])

            track.pop();
        }
    }

    dfs(0, [])

    return res
}