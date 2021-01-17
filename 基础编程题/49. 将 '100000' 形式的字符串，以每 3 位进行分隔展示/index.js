// 将'10000000000'形式的字符串，以每3位进行分隔展示'10.000.000.000',多种实现方式

/**
 * 方法一：字符串转数组，插入分隔符号，再转换为字符串输出
 * @param {string} str 
 * @param {string} point 
 */
function convertStr(str, point = '.') {

    let arr = str.split('');
    let res = [];

    let len = arr.length;
    let index = 1;

    while (len--) {
        res.unshift(arr[len]);

        if (index++ == 3) {
            res.unshift(point);
            index = 1;
        }
    }

    return res.join('');
}

/**
 * 方法二：正则表达式
 * @param {*} str 
 * @param {*} point 
 */
function convertStr2(str, point = '.') {

    return str.replace(/(?!^)(?=(\d{3})+$)/g, point)
}

function convertStr3(str, point = '.') {

    return str.replace(/\d(?=(\d{3})+$)/g, `$&${point}`)
}

let str = '10000000000';

console.log('str1:', convertStr(str, ','));

console.log('str2:', convertStr2(str, ','));

console.log('str3:', convertStr3(str, ','));