
function getMax(str) {
    let res = {}
    let map = new Map()
    let max = 0
    let prevChar = ''

    for (let char of str) {
        if (prevChar === char) {
            map.set(char, map.get(char) + 1)

            if (map.get(char) > max) {
                max = map.get(char)
                res = {
                    [char]: map.get(char)
                }
            } else if (map.get(char) === max) {
                res[char] = max
            }

        } else {
            map.set(char, 1)
            prevChar = char
        }
    }

    return res
}

console.log(getMax('aaaaabbkeccjsbcccwqaaax')) //- {c:3}

