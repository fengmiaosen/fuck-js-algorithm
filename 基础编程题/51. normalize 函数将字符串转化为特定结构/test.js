// 实现一个 normalize 函数，能将输入的特定的字符串转化为特定的结构化数据

// 字符串仅由小写字母和 [] 组成，且字符串不会包含多余的空格。
// 示例一: 'abc' --> {value: 'abc'}
// 示例二：'[abc[bcd[def]]]' --> {value: 'abc', children: {value: 'bcd', children: {value: 'def'}}}

function normalize(str) {
    let arr = str.split(/[\[\]]/g).filter(t => !!t)

    let res = {}

    arr.reduce((acc, cur, idx) => {
        if (idx === 0) {
            acc.value = cur
            return acc
        } else {
            acc.children = {
                value: cur
            }
            return acc.children
        }
    }, res)

    return res
}

const s = '[abc[bcd[def]]]'

console.log('normalize obj 1:', normalize(s));