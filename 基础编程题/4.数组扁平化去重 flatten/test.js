var arr = [1, 2, 3, [4, 5], [6, [7, [8, [10, 11, 13]]]]]

function flat(arr) {
    let res = []

    for (let item of arr) {
        if (Array.isArray(item)) {
            res.push(...flat(item))
        } else {
            res.push(item)
        }
    }

    return res

}

console.log(flat(arr))