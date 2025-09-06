// 实现一个 normalize 函数，能将输入的特定的字符串转化为特定的结构化数据

// 字符串仅由小写字母和 [] 组成，且字符串不会包含多余的空格。
// 示例一: 'abc' --> {value: 'abc'}
// 示例二：'[abc[bcd[def]]]' --> {value: 'abc', children: {value: 'bcd', children: {value: 'def'}}}

/**
 * 
 * @param {string} str 
 * @returns 
 */
function normalize(str) {
    let res = {}
    // array
    let arrs = str.split(/[\[\]]/g).filter(t => t)

    arrs.reduce((acc, cur, idx) => {
        acc.value = cur;
        if (idx !== arrs.length - 1) {
            acc.children = {};
            return acc.children;
        }
    }, res)

    return res
}

console.log('normalize 1:', normalize('abc'))
console.log('normalize 2:', normalize('[abc[bcd[def]]]'))