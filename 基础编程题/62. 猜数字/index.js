// xAyB猜字游戏，输入两组数字，每组数字包含4个非负整数，同一组中的四个数字互不相同，数字间以空格分隔。

// 第一组数字为猜数字游戏的正确答案，第二组数字为玩家所猜的答案，根据以下规则输出猜数字的结果xAyB。

// 规则1：如果数字相同，且位置相同，则得到一个A

// 规则2：如果数字相同，且位置不同，则得到一个B

// 输入描述：两组数字，每组数字包含4个非负整型数字，同一组中的四个数字互不相等，数字以空格分隔

// 输出描述：xAyB

// 示例：

// 输入：

// 1 2 3 4

// 1 2 5 3

// 输出：

// 2A1B

/**
 * 
 * @param {string} str1 
 * @param {string} str2 
 */
function fn(str1, str2) {

    let list1 = str1.split(' ');
    let list2 = str2.split(' ');

    let len = list1.length;

    let countA = 0;
    let countB = 0;

    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            if (list1[i] === list2[j]) {
                if (i == j) {
                    countA++;
                } else {
                    countB++;
                }
            }
        }

    }

    let res = `${countA}A${countB}B`;

    return res;
}

console.log(fn('1 2 3 4', '1 2 5 3'));