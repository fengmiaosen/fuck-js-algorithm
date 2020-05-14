var arr = [
    [1, 2, 2],
    [3, 4, 5, 5],
    [6, 7, 8, 9, [11, 12, [12, 13, [14]]]]
];

function flat(list) {

    if (list.length < 1) {
        return [];
    }

    let res = [];

    for (let item of list) {

        if (Array.isArray(item)) {
            res = [...res, ...flat(item)]
        } else {
            res.push(item);
        }
    }

    return res;

}

function uniq(list) {
    return [...new Set(list)];
}

console.log('array flat:', uniq(flat(arr)));