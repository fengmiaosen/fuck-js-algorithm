
// 输入："abbbaca"
// 输出："ca"
// 解释："abbbaca" => "aaca"=>"ca"
// LeetCode 1047. 删除字符串中的所有相邻重复项
// https://leetcode-cn.com/problems/remove-all-adjacent-duplicates-in-string/

function removeDup(str) {
    let stack = ['']

    for (let char of str) {

        let prevChar = stack.pop()

        if (prevChar !== char) {
            stack.push(prevChar)
            stack.push(char)
        }
    }

    return stack.join('')
}


console.log(removeDup('abbaca'))