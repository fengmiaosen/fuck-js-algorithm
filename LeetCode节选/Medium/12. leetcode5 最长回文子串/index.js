// 给定一个字符串 s，找到 s 中最长的回文子串。你可以假设 s 的最大长度为 1000。

// 示例 1：

// 输入: "babad"
// 输出: "bab"
// 注意: "aba" 也是一个有效答案。
// 示例 2：

// 输入: "cbbd"
// 输出: "bb"

/**
 * 
 * @param {string} s 
 * @returns 
 */
function longestPalindrome(s) {
    if (s.length < 2) {
        return s.length
    }

    let start = 0
    let end = 0

    function isPalindrome(str, left, right) {
        while (left >= 0 && right < str.length) {
            if (str[left] !== str[right]) {
                return 0
            }

            left--
            right++
        }

        return right - left - 1

    }

    for (let i = 0; i < s.length; i++) {

        let len1 = isPalindrome(s, i, i)

        let len2 = isPalindrome(s, i, i + 1)

        let len = Math.max(len1, len2)

        if (len > end - start) {
            start = i - parseInt((len - 1) / 2)
            end = i + parseInt(len / 2)
        }
    }

    return s.substring(start, end + 1)
}

console.log(longestPalindrome('babad'))
console.log(longestPalindrome("racecar")) 
console.log(longestPalindrome("!@#@!")) 