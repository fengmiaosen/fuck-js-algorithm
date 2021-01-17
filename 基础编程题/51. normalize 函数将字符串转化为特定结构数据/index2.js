// 实现一个 normalize 函数，能将输入的特定的字符串转化为特定的结构化数据

// 字符串仅由小写字母和 [] 组成，且字符串不会包含多余的空格。
// 示例一: 'abc' --> {value: 'abc'}
// 示例二：'[abc[bcd[def]]]' --> {value: 'abc', children: {value: 'bcd', children: {value: 'def'}}}

/**
 * 
 * @param {string} str 
 */
function normalize(str) {

    //只匹配字符串中的字母部分，得到其字符串数组
    const arr = str.match(/\w+/g)
    console.log(arr)
    // const arr = str.split(/[\[\]]/g).filter(item => item)
    // console.log('arr split', arr)

    const res = {}

    arr.reduce((prevObj, cur, idx) => {
        prevObj.value = cur
        if (idx !== arr.length - 1) {
            prevObj.children = {}
        }
        return prevObj.children
    }, res)

    return res
}

console.log(normalize('[abc[bcd[def]]]'))