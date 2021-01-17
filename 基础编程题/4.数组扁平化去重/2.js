var arr = [
    [1, 2, 2],
    [3, 4, 5, 5, 20, [[90]]],
    [6, 7, 8, 9, [11, 12, [12, 13, [14]]]]
];

function uniq(list){
    return Array.from(new Set(list))
}

/**
 * 方法一：递归，无闭包
 * @param {*} list 
 */
function flat(list) {
    if (list.length < 1) {
        return []
    }

    let res = []

    for(let value of list){
        if(Array.isArray(value)){
            res = [...res, ...flat(value)]
        }else{
            res.push(value)
        }
    }

    return res
}

/**
 * 方法二：广度优先遍历
 * @param {*} list 
 */
function flat2(list) {
    let res = []
    let queue = [list]

    while(queue.length){
        const node = queue.shift()

        if(Array.isArray(node)){
            node.forEach(item => {
                queue.push(item)
            })
        }else{
            res.push(node)
        }
    }

    return res
}

console.log('flat array 1:', uniq(flat(arr)));
console.log('flat array 2:', uniq(flat(arr)));
