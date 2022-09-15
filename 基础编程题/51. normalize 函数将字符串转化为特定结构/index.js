// 实现一个 normalize 函数，能将输入的特定的字符串转化为特定的结构化数据

// 字符串仅由小写字母和 [] 组成，且字符串不会包含多余的空格。
// 示例一: 'abc' --> {value: 'abc'}
// 示例二：'[abc[bcd[def]]]' --> {value: 'abc', children: {value: 'bcd', children: {value: 'def'}}}

/**
 * 方法一
 * @param {string} str 
 */
function normalize(str) {

    //只匹配字符串中的字母部分，得到其字符串数组
    // const arr = str.match(/\w+/g);
    const arr = str.split(/[\[\]]/g).filter((item) => item);
    console.log('arr match:', arr)
    
    let result;

    // 倒序遍历，从叶子节点字段开始，自底向上
    while (arr.length) {
        const item = arr.pop();

        //当前字段构造的对象
        let temp = { value: item };

        if (result) {
            temp.children = result;
        }

        result = temp;
    }

    return result;

}

const s = '[abc[bcd[def]]]'

console.log('normalize obj1:', normalize('abc'));
console.log('normalize obj2:', normalize(s));