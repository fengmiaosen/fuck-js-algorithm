
/**
 * 
 * @param {array} arr 
 * @returns 
 */
function quickSort(arr) {

    if (arr.length <= 1) {
        return arr;
    }

    let midIdx = Math.floor(arr.length / 2)
    let midValue = arr.splice(midIdx, 1)[0]

    let leftArr = []
    let rightArr = []

    for (let v of arr) {
        if (v < midValue) {
            leftArr.push(v)
        } else {
            rightArr.push(v)
        }
    }

    return [...quickSort(leftArr), midValue, ...quickSort(rightArr)]
}

let testArr = [32, 12, 56, 78, 76, 45, 36, 28];
let arr = quickSort(testArr);
console.log(arr); 