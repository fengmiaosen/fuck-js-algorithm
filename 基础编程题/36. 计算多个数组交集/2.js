
let arr1 = [1, 3, 3, 5, 7, 6];
let arr2 = [2, 3, 6, 6, 8];
let arr3 = [5, 0, 4, 3, 9, 6];

function getIntersect(...arrs) {

    if (arrs.length === 0) {
        return [];
    }

    if (arrs.length === 1) {
        return arrs;
    }

    let res = arrs.reduce((filters, cur) => {
        return filters.filter(item => cur.includes(item));
    });

    // 去重
    res = [...new Set(res)]

    return res;
}

console.log('array intersect:', getIntersect(arr1, arr2, arr3));