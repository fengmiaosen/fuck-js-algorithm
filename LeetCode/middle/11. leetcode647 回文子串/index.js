// 给定一个字符串，你的任务是计算这个字符串中有多少个回文子串。

// 具有不同开始位置或结束位置的子串，即使是由相同的字符组成，也会被视作不同的子串。

// 示例 1：

// 输入："abc"
// 输出：3
// 解释：三个回文子串: "a", "b", "c"
// 示例 2：

// 输入："aaa"
// 输出：6
// 解释：6个回文子串: "a", "a", "a", "aa", "aa", "aaa"
// 提示：

// 输入的字符串长度不会超过 1000 。

// https://leetcode.cn/problems/palindromic-substrings/

// 解法一：暴力法
let countSubstrings = function (s) {
    let count = 0
    for (let i = 0; i < s.length; i++) {
        for (let j = i; j < s.length; j++) {
            if (isPalindrome(s.substring(i, j + 1))) {
                count++
            }
        }
    }
    return count
}

let isPalindrome = function (s) {
    let i = 0, j = s.length - 1
    while (i < j) {
        if (s[i] != s[j]) return false
        i++
        j--
    }
    return true
}


//中心扩展法
/**
 * @param {string} s
 * @return {number}
 */
var countSubstrings2 = function (s) {
    let res = 0
    let nums = s.length;
    if (s.length < 2) {
        return nums
    }

    /**
     * 
     * @param {string} str 
     * @param {number} left 
     * @param {number} right 
     */
    function isPalindrome(str, left, right) {
        while (left >= 0 && right < str.length) {
            if (str[left] !== str[right]) {
                return false
            }
            left--
            right++
            res++
        }
    }

    for (let i = 0; i < s.length; i++) {
        isPalindrome(s, i, i)
        isPalindrome(s, i, i + 1)
    }


    return res
};

console.log(countSubstrings("abc"))
console.log(countSubstrings("aaa"))

console.log(countSubstrings2("abc"))
console.log(countSubstrings2("aaa"))