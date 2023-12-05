// https://leetcode.cn/problems/fan-zhuan-dan-ci-shun-xu-lcof/
// 输入一个英文句子，翻转句子中单词的顺序，但单词内字符的顺序不变。为简单起见，标点符号和普通字母一样处理。例如输入字符串"I am a student. "，则输出"student. a am I"。

/**
 * 
 * @param {string} str 
 */
let reverseWords = function (str) {
    let list = str.trim().split(' ')
    let l = 0;
    let r = list.length - 1

    while (l < r) {
        [list[r], list[l]] = [list[l], list[r]]
        l++
        r--
    }

    return list.join(' ')
};

console.log(reverseWords("  hello world!  "))
