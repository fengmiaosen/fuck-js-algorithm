function permute(nums) {
    let res = []

    function dfs(track) {
        if(track.length === nums.length){
            res.push([...track])
            return
        }

        for (let num of nums) {

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
console.log(permute([1, 2, 3, 4]))