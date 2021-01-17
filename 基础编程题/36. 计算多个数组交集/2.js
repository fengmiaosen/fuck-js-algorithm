
function intersect(...arrs) {

    if (arrs.length < 2) {
        return arrs
    }

    const res = arrs.reduce((prevValue, cur) => {
        return prevValue.filter(item => cur.includes(item))
    })

    return [...new Set(res)]
}

let arr1 = [1,3,3,5,7,6];
let arr2 = [2,3,6,6,8];
let arr3 = [5,0,4,3,9,6];

console.log(intersect(arr1, arr2, arr3))