var arr1 = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D'];
var arr2 = ['A', 'B', 'C'];
var arr3 = ['A3', 'B3', 'C3'];

/**
 * 合并两个字符串数组
 * TODO 支持多个字符串数组的合并
 * @param {*} arr1 
 * @param {*} arr2 
 */
function mergeList(arr1, arr2) {

    // 先合并，再按照默认字符串排序规则排序
    // 默认排序顺序是在将元素转换为字符串，然后比较它们的UTF-16代码单元值序列时构建的
    const arr = [...arr1, ...arr2].sort();

    //字符串首字母相同的情况下，根据字符串长度进行排序
    let res = arr.sort((a, b) => {
        if (a[0] === b[0] && a.length > b.length) {
            return -1;
        } else {
            return 1;
        }
    });

    return res;
}

/**
 * 剩余参数语法允许我们将一个不定数量的参数表示为一个数组
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Rest_parameters
 * @param  {...any} arrs 
 */
function mergeMultiArray(...arrs) {

    const arrList = arrs.reduce((arr, cur) => arr.concat(cur));
    arrList.sort();

    let res = arrList.sort((a, b) => {
        if (a[0] === b[0] && a.length > b.length) {
            return -1;
        } else {
            return 1;
        }
    });

    return res;
}

console.log('merge array:', mergeList(arr1, arr2));

console.log('merge list:', mergeMultiArray(arr1, arr2, arr3));
