var arr = [
    [1, 2, 2],
    [3, 4, 5, 5],
    [6, 7, 8, 9, [11, 12, [12, 13, [14]]]]
];

function flapArray(arr) {
    if (arr.length < 1) {
        return []
    }

    let res = []

    for (let value of arr) {
        if (Array.isArray(value)) {
            res = [...res, ...flapArray(value)]
        } else {
            res.push(value)
        }
    }

    return res;
}

function uniqArray(arr){
    return Array.from(new Set(arr))
}

console.log('flat array:', uniqArray(flapArray(arr)))