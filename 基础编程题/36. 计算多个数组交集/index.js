
function getIntersection(...arrs) {
    //边界条件判断
    if(arrs.length ===0){
        return [];
    }

    if(arrs.length === 1){
        return arrs;
    }
    
    const interList = arrs.reduce((acc ,cur) => {
        return acc.filter(item => cur.includes(item))
    });

    return [...new Set(interList)];
}

let arr1 = [1,3,3,5,7,6];
let arr2 = [2,3,6,6,8];
let arr3 = [5,0,4,3,9,6];

console.log(getIntersection(arr1, arr2, arr3))