

function flat(arr) {

    const res = []
    const queue = [...arr]

    while (queue.length) {
        const node = queue.shift()

        if (Array.isArray(node)) {
            queue.unshift(...node)
        } else {
            res.push(node)
        }
    }

    return res
}

var arr = [1, 2, 3, [4, 5], [6, [7, [8, [10, 11, 13, [15, [18]]]]]]]


console.log('flat arr:', flat(arr));