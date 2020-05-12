
function getMax(str) {

    //若要保证字符添加的顺序，可考虑使用new Map()
    let map = {};

    let res = {};

    let max = 0;
    let curChar = '';

    for (let i = 0; i < str.length; i++) {
        const item = str[i];

        if (item === curChar) {
            // 相同字符串加1
            map[item] += 1;
        } else {
            //出现不连续字符的时候，初始化当前字符出现次数为1，
            map[item] = 1;
            curChar = item;
        }

        // 若当前字符的最大次数大于已记录的最大次数（至于是哪个字符，我们不用关心）
        if (map[item] > max) {
            max = map[item];

            // 清空结果对象，只记录当前字符的最大次数
            res = {
                [item]: max
            };
        } else if (map[item] === max) {
            // 若最大次数已经出现过，则追加记录当前字符的次数，可能就是同一字符，也可能不是
            res[item] = max;
        }

    }

    console.log('map:', map, 'curChar:', curChar);

    return res;
}

console.log(getMax('aaaaabbkeccjsbcccwqaaax')) //- {c:3}
