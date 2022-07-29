// 编写一个函数来查找字符串数组中的最长公共前缀。

// 如果不存在公共前缀，返回空字符串 ""。

// 示例 1:

// 输入: ["flower","flow","flight"]
// 输出: "fl"
// 示例 2:

// 输入: ["dog","racecar","car"]
// 输出: ""
// 解释: 输入不存在公共前缀。

// https://leetcode.cn/problems/longest-common-prefix/submissions/

/**
 * 
 * @param {string[]} strs 
 */
function longCommonPrefix(strs) {

    let res = strs[0]

    for (let i = 1; i < strs.length; i++) {
        let str = strs[i]
        let j = 0
        
        for (; j < str.length && j < res.length; j++) {
            if (str[j] !== res[j]) {
                break;
            }
        }
        res = res.slice(0, j)
    }


    return res;
}

console.log(longCommonPrefix(["flower", "flow", "flight"]))
console.log(longCommonPrefix(["dog","racecar","car"]))
