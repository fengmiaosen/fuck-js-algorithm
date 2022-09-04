// // 找出字符串中连续出现最多的字符和个数

// 'abcaakjbb' => {'a':2,'b':2}
// 'abbkejsbcccwqaa' => {'c':3}

// 注意：题目说的是连续出现，注意连续二字

function getMax(str) {

    //若要保证字符添加的顺序，可考虑使用new Map()
    let map = {};

    let res = {};

    let max = 0;

    let prevChar = '';

    for (let i = 0; i < str.length; i++) {
        const item = str[i];

        if (item === prevChar) {
            // 相同字符串加1
            map[item] += 1;
        } else {
            //出现不连续字符的时候
            map[item] = 1;
            prevChar = item;
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

    return res;
}

console.log(getMax('aaaaabbkeccjsbcccwqaaax')) //- {c:3}

// 方法二
function fn2(str) {
    let res = {}

    // 也可直接用字面量对象 {}
    let map = new Map()

    let max = 0
    let prevChar = ''

    for (let char of str) {
        if (prevChar === char) {
            map.set(char, map.get(char) + 1)

            if (map.get(char) > max) {
                max = map.get(char)
                res = {
                    [char]: max
                }
            } else if (map.get(char) === max) {
                res[char] = max
            }
        } else {
            map.set(char, 1)
            prevChar = char
        }
    }

    return res
}

console.log(fn2('aaabbkecccjsbcccwqaaax')) //- {c:3}
