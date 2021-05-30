var arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10];

function flat(list) {
    let res = [];

    for (let item of list) {
        if (Array.isArray(item)) {
            res = [...res, ...flat(item)];
        } else {
            res.push(item);
        }
    }

    return res;
}

function uniqSort(list) {
    return [...new Set(list)].sort((a, b) => a - b);
}

let res = uniqSort(flat(arr));

console.log('flat arr:', res);