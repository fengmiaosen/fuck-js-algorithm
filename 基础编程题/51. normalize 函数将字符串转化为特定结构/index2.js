// 实现一个 normalize 函数，能将输入的特定的字符串转化为特定的结构化数据

// 字符串仅由小写字母和 [] 组成，且字符串不会包含多余的空格。
// 示例一: 'abc' --> {value: 'abc'}
// 示例二：'[abc[bcd[def]]]' --> {value: 'abc', children: {value: 'bcd', children: {value: 'def'}}}

/**
 * 
 * @param {string} str 
 */
function normalize(str) {
    const arr = str.split(/[\[\]]/g).filter(item => !!item);

    let res = {};

    arr.reduce((acc, cur, idx) => {
        acc.value = cur;

        if (idx !== arr.length - 1) {
            acc.children = {};
            return acc.children;
        }

    }, res);

    return res;
}

/**
 * 
 * @param {string} str 
 * @returns 
 */
function normalize2(str) {

    let arr = str.split(/[\[\]]/g).filter(Boolean);

    let res = {};
    let cur = {};

    arr.forEach((item, idx) => {
        if (idx == 0) {
            res.value = item;
            cur = res;
        } else {
            cur.children = {
                value: item
            };
            cur = cur.children;
        }
    })

    return res;
}

const s = '[abc[bcd[def]]]'

console.log('normalize obj 1:', normalize(s));

console.log('normalize obj 2:', normalize2(s));
