
/**
 * 实现一个字符串匹配算法，从长度为 n 的字符串 S 中，查找是否存在字符串 T，T 的长度是 m，若存在返回所在位置
 * @param {string} S 
 * @param {string} T 
 */
function find(S, T) {

    if (S.length < T.length) {
        return -1;
    }

    const idxArr = [];
    let idx = S.indexOf(T);

    while (idx !== -1) {
        idxArr.push(idx);
        idx = S.indexOf(T, idx + T.length);
    }

    return idxArr;
}

console.log('str find:', find('FishPlusOrangePlus', 'Plus'))