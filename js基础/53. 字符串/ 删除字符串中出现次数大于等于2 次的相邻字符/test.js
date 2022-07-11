
function removeDuplicates(str){
    let stack = []

    for(let char of str){

        let preChar = stack.pop()

        if(preChar !== char){
            stack.push(preChar)
            stack.push(char)
        }

    }

    return stack.join('')
}


console.log(removeDuplicates("abbaca"))