// 字符串仅由小写字母和 [] 组成，且字符串不会包含多余的空格。
// 示例一: 'abc' --> {value: 'abc'}
// 示例二：'[abc[bcd[def]]]' --> {value: 'abc', children: {value: 'bcd', children: {value: 'def'}}}

function normalize(str) {

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



let str = '[abc[bcd[def]]]'

console.log('normalize:', normalize(str))