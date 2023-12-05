// 参考 https://github.com/sisterAn/JavaScript-Algorithms/issues/28

var removeDuplicates = function (S) {
    if (S.length < 2) {
        return S
    }

    let stack = [S[0]]

    for (let i = 1; i < S.length; i++) {
        let pre = stack.pop()

        if (pre !== S[i]) {
            stack.push(pre)
            stack.push(S[i])
        }
    }

    return stack.join('')
};

console.log(removeDuplicates("abbaca"))