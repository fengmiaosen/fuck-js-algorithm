let arr = [1, 2, 3, 2, [2, 3], [2, [1], 2]]

function flatList(list) {
    return flat(list);
}


function flat(arr, res = []) {

    arr.forEach(item => {
        if (Array.isArray(item)) {
            res.concat(flat(item, res));
        } else {
            res.push(item);
        }
    });

    return res;
}

console.log('array flat:', flatList(arr))