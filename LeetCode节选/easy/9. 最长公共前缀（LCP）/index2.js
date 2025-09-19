/**
 * 
 * @param {array} strs 
 */
function longCommonPrefix(strs) {
    let res = strs[0]

    for (let i = 1; i < strs.length; i++) {

        let j = 0
        while (j < strs[i].length && j < res.length) {
            if (res[j] !== strs[i][j]) {
                break
            }
            j++
        }
        res = res.slice(0, j)
    }

    return res
}

console.log(longCommonPrefix(["flower", "flow", "flight"]))
