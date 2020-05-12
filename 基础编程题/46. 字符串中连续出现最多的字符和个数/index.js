// // 找出字符串中连续出现最多的字符和个数

// 'abcaakjbb' => {'a':2,'b':2}
// 'abbkejsbcccwqaa' => {'c':3}
// 注意：题目说的是连续出现，注意连续二字

function getStrMaxLengthObj (str) {
    if (!str) { return {} }
    let strObj = {}
    let res = {}
    let max = 0
    let currentLetter = ''

    for (let i = 0; i < str.length; i ++) {
        let item = str[i]

        if (currentLetter === item) {
            strObj[item] += 1
        } else {
            currentLetter = item
            strObj[item] = 1
        }

        if (strObj[item] > max) {
            max = strObj[item]
            res = {}
            res[item] = max
        } else if (strObj[item] === max) {
            res[item] = max
        }
    }

    return res
}

console.log(getStrMaxLengthObj('aaaaabbkeccjsbcccwqaaax')) //- {c:3}