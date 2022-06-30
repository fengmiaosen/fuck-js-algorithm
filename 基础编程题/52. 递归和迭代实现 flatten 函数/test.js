var arr = [1, 2, 3, [4, 5], [6, [7, [8, [10, 11, 13]]]]]

// 方法一： 递归实现
function flatten(arr) {
    let res = []

    for (let item of arr) {
        if (Array.isArray(item)) {
            res.push(...flatten(item))
        } else {
            res.push(item)
        }
    }

    return res;
}

// 方法二：迭代实现
function flat(arr) {
    let res = []
    let queue = [...arr]

    while (queue.length) {
        const item = queue.shift()

        if(Array.isArray(item)){
            queue.unshift(...item);
        }else{
            res.push(item)
        }
    }

    return res
}


console.log('flatten arr:', flatten(arr));
console.log('flatten arr2:', flat(arr));