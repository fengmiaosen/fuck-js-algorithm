
/**
 * 
 * @param {array} arr 
 * @returns 
 */
function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    let midIdx = Math.floor(arr.length / 2)
    let leftArr = arr.slice(0, midIdx)
    let rightArr = arr.slice(midIdx)

    return merge(mergeSort(leftArr), mergeSort(rightArr))
}

/**
 * 合并两个有序数组
 * @param {array} arr1 
 * @param {array} arr2 
 * @returns 
 */
function merge(arr1, arr2) {
    let res = []

    while (arr1.length && arr2.length) {
        if (arr1[0] < arr2[0]) {
            res.push(arr1.shift())
        } else {
            res.push(arr2.shift())
        }
    }

    if (arr1.length) {
        res.push(...arr1)
    }

    if (arr2.length) {
        res.push(...arr2)
    }

    return res
}


var testArr = [32, 12, 56, 78, 76, 45, 36, 10, 76, 39];
var arr = mergeSort(testArr);
console.log(arr);   // [12, 32, 36, 45, 56, 76, 78]