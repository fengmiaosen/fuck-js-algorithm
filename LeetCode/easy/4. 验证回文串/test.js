// 给定一个字符串，验证它是否是回文串，只考虑字母和数字字符，可以忽略字母的大小写。

// 说明：本题中，我们将空字符串定义为有效的回文串。

// 示例 1:

// 输入: "A man, a plan, a canal: Panama"
// 输出: true
// 示例 2:

// 输入: "race a car"
// 输出: false

/**
 * 
 * @param {string} str 
 */
function isPalindrome(str) {
    // 正则匹配移除非字母和数字的字符
    str = str.replace(/[^0-9a-zA-Z]/g, '')
    console.log('str:', str)

    // 双指针
    let left = 0
    let right = str.length - 1

    while (left < right) {
        if (str[left].toLocaleLowerCase() !== str[right].toLocaleLowerCase()) {
            return false
        }

        left++
        right--
    }

    return true
}

let str = "race a car";

console.log(isPalindrome(str));

console.log(isPalindrome('abcba'));

console.log(isPalindrome('A man, a plan, a canal: Panama'));