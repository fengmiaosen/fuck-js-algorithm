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

    const customComparator = (a, b) => {
        // 首字符相同时，按照长度倒序排列；否则按字典序排列
        if (a[0] === b[0]) {
            return b.length - a.length;
        }
        return a.localeCompare(b);
    };

    // 一次排序即可完成需求
    return [...arr1, ...arr2].sort(customComparator);
}

/**
 * 剩余参数语法允许我们将一个不定数量的参数表示为一个数组
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Rest_parameters
 * @param  {...any} arrs 
 */
function mergeMultiArray(...arrs) {

    const customComparator = (a, b) => {
        if (a[0] === b[0]) {
            return b.length - a.length;
        }
        return a.localeCompare(b);
    };

    const merged = arrs.flat(); // 合并所有数组

    return merged.sort(customComparator);
}

console.log('merge array:', mergeList(arr1, arr2));

console.log('merge list:', mergeMultiArray(arr1, arr2, arr3));
