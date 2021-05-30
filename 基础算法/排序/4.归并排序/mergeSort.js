
function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    var midIndex = Math.floor(arr.length / 2);
    var leftArr = arr.slice(0, midIndex);
    var rightArr = arr.slice(midIndex);

    return merge(mergeSort(leftArr), mergeSort(rightArr));
}

/**
 * 合并两个有序数组
 * @param {*} leftArr 
 * @param {*} rightArr 
 */
function merge(leftArr, rightArr) {

    var arr = [];

    while (leftArr.length > 0 && rightArr.length > 0) {
        if(leftArr[0]<rightArr[0]){
            arr.push(leftArr.shift());
        } else {
            arr.push(rightArr.shift());
        }
    }

    return arr.concat(leftArr).concat(rightArr);
}

var testArr = [32,12,56,78,76,45,36];
var arr = mergeSort(testArr);
console.log(arr);   // [12, 32, 36, 45, 56, 76, 78]