

function combine(...chunks) {
    let res = []


    function dfs(idx, track) {
        if (idx === chunks.length) {
            res.push([...track])
            return
        }

        let chunk = chunks[idx]
        for (let item of chunk) {

            track.push(item)

            dfs(idx + 1, [...track])

            track.pop()
        }
    }

    dfs(0, [])

    return res
}


let names = ["iPhone 14", "iPhone 15"]

let colors = ["黑色", "白色"]

let storages = ['128G', "256g", "512G", "1T"]

let type = ["Max", 'Pro', "ProMax"]

console.log(combine(names, colors, storages, type))
