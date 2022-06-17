let arr1 = [1, 2, 3, 4, 6, 9];
let arr2 = [3, 4, 7, 9];
let arr3 = [1, 3, 4, 7, 9];


function intersect(...arrlist){
    return arrlist.reduce((acc, cur) => {
        return acc.filter(item => cur.includes(item))
    })
}


console.log(intersect(arr1, arr2, arr2))