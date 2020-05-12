
/**
 * 主要逻辑：肯定是需要递归的~
 * 先将第一个字母取出，然后将剩下的字符串全排列。将这个字母，依次插入到每个排列所有缝隙。
如：abc进行全排列，取出a，得到全排列bc和cb，先向bc插，可以得到abc，bac，bca；再向cb插，得到acb，cab，cba；
 * @param {*} str 
 */
function func(str) {

    if (str.length < 2) {
        return [str];
    }
    
    let result = [];
    let start = str.slice(0, 1);
    let rightResults = func(str.slice(1));

    for (let i = 0; i < rightResults.length; i++) {
        for (let j = 0; j < rightResults[i].length + 1; j++) {
            result.push(rightResults[i].slice(0,j) + start + rightResults[i].slice(j));
        }
    }

    return result;
}

console.log('全排列:', func('abcd'));