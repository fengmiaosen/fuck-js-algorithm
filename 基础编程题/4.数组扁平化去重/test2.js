var arr = [
    [1, 2, 2],
    [3, 4, 5, 5],
    [15, 9],
    [6, 7, 8, 9, [11, 12, [12, 13, [14]]]]
];

function flapArray(arr) {
    const res = []
    const queue = [arr]

    while(queue.length){
        const item = queue.shift()

        if(Array.isArray(item)){
            for(let v of item){
                queue.push(v);
            }
        }else{
            res.push(item);
        }
    }

    return res;
}

function uniqArray(arr) {
    return Array.from(new Set(arr))
}

console.log('flat array:', uniqArray(flapArray(arr)))