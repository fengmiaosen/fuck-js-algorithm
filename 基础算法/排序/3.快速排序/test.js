
/**
 * 
 * @param {Array<number>} arr 
 * @returns {Array<number>}
 */
function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    let midIndex = Math.floor(arr.length / 2);
    let midValue = arr.splice(midIndex, 1)[0];

    let leftArr = [];
    let rightArr = [];

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < midValue) {
            leftArr.push(arr[i]);
        } else {
            rightArr.push(arr[i]);
        }
    }

    return quickSort(leftArr).concat([midValue]).concat(quickSort(rightArr));

}


let testArr = [32, 12, 56, 78, 76, 45, 36];
let arr = quickSort(testArr);
console.log('quickSort', arr);   // [12, 32, 36, 45, 56, 76, 78]
