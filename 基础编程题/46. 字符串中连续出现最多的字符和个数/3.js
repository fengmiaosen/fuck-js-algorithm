
/**
 * TODO 考虑滑动窗口算法优化
 * @param {*} str 
 */
function findMax(str) {

    let res = {};

    let map = {};

    let tempChar = '';

    let max = 0;

    for (let i = 0; i < str.length; i++) {
        const item = str[i];

        if (item === tempChar) {
            map[item]++;
        } else {
            map[item] = 1;
            tempChar = item;
        }

        //比较最大出现次数
        if (map[item] > max) {
            max = map[item];

            //max如果发生更新，则重置结果对象为当前字符及其次数
            res = {
                [item]: max
            };
        } else if (map[item] === max) {
            res[item] = max;
        }
    }

    return res;
}

console.log(findMax('aaabbkecccjsbcccwqaaax')) //- {c:3}
