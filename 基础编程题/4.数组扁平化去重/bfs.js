var arr = [
    [1, 2, 2],
    [3, 4, 5, 5, 20, [[90]]],
    [6, 7, 8, 9, [11, 12, [12, 13, [14]]]]
];

function uniq(list){
    return Array.from(new Set(list))
}
/**
 * 方法二：广度优先遍历
 * @param {*} list 
 */
function flat2(list) {
    let res = []
    let queue = [...list]

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


console.log('flat array 2:', uniq(flat2(arr)));
