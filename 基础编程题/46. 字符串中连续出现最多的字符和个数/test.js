// // 找出字符串中连续出现最多的字符和个数

// 'abcaakjbb' => {'a':2,'b':2}
// 'abbkejsbcccwqaa' => {'c':3}

// 注意：题目说的是连续出现，注意连续二字

function findMaxStr(str) {
    let res = {}
    let map = {}
    let max = 0

    let prev = ''

    for (let i = 0; i < str.length; i++) {
        let cur = str[i]

        if (prev === cur) {
            map[cur]++
        } else {
            map[cur] = 1
            prev = cur
        }

        if(map[cur] > max) {
            max = map[cur]
            res = {[cur]: max}
        } else if(map[cur] === max) {
            res[cur] = max
        }
    }

    return res
}

console.log(findMaxStr('abcaakjbb'))
console.log(findMaxStr('abbkejsbcccwqaa'))
