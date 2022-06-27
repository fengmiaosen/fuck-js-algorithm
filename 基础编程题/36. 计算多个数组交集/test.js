
let arr1 = [1, 3, 3, 5, 7, 6];
let arr2 = [2, 3, 6, 6, 8];
let arr3 = [5, 0, 4, 3, 9, 6];

function getIntersection(...arrs) {

    if (arrs.length < 2) {
        return arrs
    }

    let res = arrs.reduce((acc, cur) => {
        return acc.filter(item => cur.includes(item))
    })

    return res;
}

console.log(getIntersection(arr1, arr2, arr3))

