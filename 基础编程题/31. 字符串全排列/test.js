
function dfs(str, track, res) {
    if (track.length === str.length) {
        res.push(track.join(''))
        return;
    }

    for(let char of str){
        if(track.includes(char)){
            continue;
        }
        track.push(char)

        dfs(str, track, res)

        track.pop();
    }
}


function permutation(str) {
    let res = []
    let track = []

    dfs(str, track, res)

    return res;
}


console.dir(permutation('abcd'), { depth: null })
