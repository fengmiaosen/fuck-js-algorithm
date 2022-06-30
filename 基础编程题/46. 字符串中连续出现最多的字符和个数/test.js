// // 找出字符串中连续出现最多的字符和个数

// 'abcaakjbb' => {'a':2,'b':2}
// 'abbkejsbcccwqaa' => {'c':3}

// 注意：题目说的是 连续 出现，注意连续二字

function getMax(str) {
    let res = {}

    let map = {} //或者： new Map
    let max = 0
    let prevChar = ''

    for (let char of str) {
        if (prevChar === char) {
            map[char] += 1
        } else {
            prevChar = char
            map[char] = 1
        }

        // 要注意区分大于和等于的时候结果对象的赋值
        if (map[char] > max) {
            max = map[char]
            res = {
                [char]: max
            }
        } else if (map[char] === max) {
            res[char] = max
        }
    }

    return res;
}

console.log(getMax('abcaakjbb'))
console.log(getMax('abbkejsbcccwqaa'))
