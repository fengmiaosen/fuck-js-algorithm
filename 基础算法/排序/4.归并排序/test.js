/**
 * 
 * @param {Array} arr 
 * @returns {Array}
 */
function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    let midIndex = Math.floor(arr.length / 2);
    let leftArr = arr.slice(0, midIndex);
    let rightArr = arr.slice(midIndex);

    let left = mergeSort(leftArr);
    let right = mergeSort(rightArr);

    return merge(left, right);
}

function merge(leftArr, rightArr) {
    let res = []

    while (leftArr.length && rightArr.length) {
        if (leftArr[0] < rightArr[0]) {
            res.push(leftArr.shift());
        } else {
            res.push(rightArr.shift());
        }
    }

    if (leftArr.length) {
        res.push(...leftArr);
    }

    if (rightArr.length) {
        res.push(...rightArr);
    }

    return res
}

let testArr = [32, 12, 56, 78, 76, 45, 36];
let arr = mergeSort(testArr);
console.log('mergeSort', arr);   // [12, 32, 36, 45, 56, 76, 78]