
function permutation(str) {
    let track = []
    let res = []

    dfs(str, track, res)

    return res
}

function dfs(str, track, res) {
    if (track.length === str.length) {
        res.push(track.join(''))
        return;
    }

    for (let c of str) {
        if (track.includes(c)) {
            continue
        }
        
        track.push(c)

        dfs(str, track, res)

        track.pop()
    }
}

console.dir(permutation('abcd'), { depth: null })
