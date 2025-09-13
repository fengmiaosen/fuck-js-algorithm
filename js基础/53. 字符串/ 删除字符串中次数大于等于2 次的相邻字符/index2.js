function removeDuplicates(str) {
    if (str.length < 2) {
        return str
    }

    let stack = []

    for (let char of str) {
        let pre = stack.pop()
        if (pre !== char) {
            stack.push(pre)
            stack.push(char)
        }
    }

    return stack.join('')
}

console.log(removeDuplicates("abbaca"))
