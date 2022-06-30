
let arr = [1, 2, 3, 2, [2, 3], [2, [1], 2]]


function flat(arr) {

    let res = []

    for (let value of arr) {
        if (Array.isArray(value)) {
            res.push(...flat(value))
        } else {
            res.push(value)
        }
    }

    return res
}

function uniq(arr) {
    return [...new Set(arr)]
}

function flat2(arr) {
    let res = []
    let queue = [...arr]

    while (queue.length) {
        let item = queue.shift()

        if(Array.isArray(item)){
            queue.unshift(...item)
        }else{
            res.push(item)
        }
    }

    return res
}

console.log(flat(arr))
console.log(flat2(arr))

// console.log(uniq(flat(arr)))