
/**
 * 
 * @param {array} arr 
 * @returns 
 */
function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    let midIndex = Math.floor(arr.length / 2);
    let leftArr = arr.slice(0, midIndex);
    let rightArr = arr.slice(midIndex);

    let leftRes = mergeSort(leftArr)
    let rightRes = mergeSort(rightArr);

    return merge(leftRes, rightRes);
}

/**
 * 合并两个有序数组
 * @param {array} leftArr 
 * @param {array} rightArr 
 */
function merge(leftArr, rightArr) {

    let arr = [];

    while (leftArr.length > 0 && rightArr.length > 0) {
        if (leftArr[0] < rightArr[0]) {
            arr.push(leftArr.shift());
        } else {
            arr.push(rightArr.shift());
        }
    }

    return arr.concat(leftArr).concat(rightArr);
}

let testArr = [32, 12, 56, 78, 76, 45, 36];
let arr = mergeSort(testArr);
console.log(arr);   // [12, 32, 36, 45, 56, 76, 78]