// 滑动窗口算法

// Leetcode3
// https://mp.weixin.qq.com/s/_pDPaf-GBLsMCNp_-MsWfg
// https://leetcode.cn/problems/longest-substring-without-repeating-characters/

// 给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。

// 示例 1:

// 输入: "abcabcbb"
// 输出: 3 
// 解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
// 示例 2:

// 输入: "bbbbb"
// 输出: 1
// 解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
// 示例 3:

// 输入: "pwwkew"
// 输出: 3
// 解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
//      请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。

function lengthOfLongestSubstring(s) {
    let map = new Map(), max = 0

    // 滑动窗口数组左右边界索引
    for (let i = 0, j = 0; j < s.length; j++) {
        if (map.has(s[j])) {
            i = Math.max(map.get(s[j]) + 1, i)
        }
        // 根据滑动窗口数组左右边界计算当前长度，更新当前最大长度数值
        max = Math.max(max, j - i + 1)
        map.set(s[j], j)
    }
    return max
};

/**
 * 
 * @param {string} s 
 */
function lengthOfLongestSubstring2(s) {
    let arr = [], max = 0

    for (let i = 0; i < s.length; i++) {
        let index = arr.indexOf(s[i])
        if (index !== -1) {
            arr.splice(0, index + 1);
        }
        arr.push(s.charAt(i))
        max = Math.max(arr.length, max)
    }

    return max
}

console.log(lengthOfLongestSubstring('abcabcbb'))
console.log(lengthOfLongestSubstring('bbbbb'))
console.log(lengthOfLongestSubstring('pwwkew'))

console.log('====================================')
console.log(lengthOfLongestSubstring2('abcabcbb'))
console.log(lengthOfLongestSubstring2('bbbbb'))
console.log(lengthOfLongestSubstring2('pwwkew'))