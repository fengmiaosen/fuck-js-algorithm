
let combine = function (...chunks) {
    let res = []

    let helper = function (chunkIndex, prev) {
        let chunk = chunks[chunkIndex]

        for (let val of chunk) {
            const cur = [...prev, val]

            if (chunkIndex === chunks.length - 1) {
                // 如果已经处理到数组的最后一项了 则把拼接的结果放入返回值中
                res.push([...cur])
            } else {
                helper(chunkIndex + 1, [...cur])
            }
        }
    }

    // 从属性数组下标为 0 开始处理
    // 并且此时的 prev 是个空数组
    helper(0, [])

    return res
}

let names = ["iPhone X", "iPhone XS"]

let colors = ["黑色", "白色"]

let storages = ["64g", "256g"]

console.log(combine(names, colors, storages))