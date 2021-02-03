// 输入："abbbaca"
// 输出："ca"
// 解释："abbbaca" => "aaca"=>"ca"
// LeetCode 1047. 删除字符串中的所有相邻重复项
// https://leetcode-cn.com/problems/remove-all-adjacent-duplicates-in-string/

function removeDuplicates(S) {
    // 栈中默认初始值为空字符串
    let stack = [''];

    for (let c of S) {
        // 栈头元素出栈，与当前位置字符比较
        let prev = stack.pop();

        // 若相等，则不作任何处理跳过当前元素
        // 若不相等，则需要先把前面栈头出栈元素再次压入栈，然后将当前元素也入栈
        // 直到全部遍历结束整个字符串
        if (prev !== c) {
            stack.push(prev);
            stack.push(c);
        }
    }

    return stack.join('');
};

console.log(removeDuplicates('abbaca'))