
function removeDuplicates(str) {
    if (str.length < 2) {
        return str
    }

    let stack = [str[0]]
    for (let i = 1; i < str.length; i++) {
        let prev=stack.pop()
        if(str[i] !== prev){
            stack.push(prev)
            stack.push(str[i])
        }
    }

    return stack.join('')
}

console.log(removeDuplicates("abbaca"))