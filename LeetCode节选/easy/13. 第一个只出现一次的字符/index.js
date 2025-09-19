// 在字符串 s 中找出第一个只出现一次的字符。如果没有，返回一个单空格。 s 只包含小写字母。

// 示例:

// s = "abaccdeff"
// 返回 "b"

// s = "" 
// 返回 " "
// 限制：

// 0 <= s 的长度 <= 50000
// https://leetcode.cn/problems/di-yi-ge-zhi-chu-xian-yi-ci-de-zi-fu-lcof/


function oneChar(str) {
    let map = new Map()

    for (let char of str) {
        if (map.has(char)) {
            map.set(char, map.get(char) + 1)
        } else {
            map.set(char, 1)
        }
    }

    let res = ''
    for ([k, v] of map.entries()) {
        if (v === 1) {
            res = k
            break
        }
    }

    return res

}

console.log(oneChar('abaccdeff'))
console.log(oneChar('xxxabaccbqdeff'))