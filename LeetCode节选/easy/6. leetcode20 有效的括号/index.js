// https://leetcode.cn/problems/valid-parentheses/description/

// 给定一个只包括 '(' ，')' ，'{' ，'}' ，'[' ，']' 的字符串，判断字符串是否有效。
// 有效字符串需满足：

// 左括号必须用相同类型的右括号闭合。
// 左括号必须以正确的顺序闭合。
// 注意空字符串可被认为是有效字符串。

// 示例 1:

// 输入: "()"
// 输出: true
// 示例 2:

// 输入: "()[]{}"
// 输出: true
// 示例 3:

// 输入: "(]"
// 输出: false
// 示例 4:

// 输入: "([)]"
// 输出: false
// 示例 5:

// 输入: "{[]}"
// 输出: true

function isValid(str) {
    let map = {
        '(': ')',
        '[': ']',
        '{': '}',
    }
    let stack = []

    for (let char of str) {
        if (map[char]) {
            stack.push(char)
        } else {
            let leftChar = stack.pop()
            if (map[leftChar] !== char) {
                return false
            }
        }
    }

    return stack.length === 0
}

console.log(isValid("()[]{}"))
console.log(isValid("([)]"))
