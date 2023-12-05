
function mergeSort(arr) {
    if (arr.length < 2) {
        return arr
    }

    let midIdx = Math.floor(arr.length / 2)
    let leftArr = arr.slice(0, midIdx)
    let rightArr = arr.slice(midIdx)

    let leftRes = mergeSort(leftArr)
    let rightRes = mergeSort(rightArr)

    return merge(leftRes, rightRes)
}

function merge(leftArr, rightArr) {
    let arr = []

    while (leftArr.length && rightArr.length) {
        if (leftArr[0] < rightArr[0]) {
            arr.push(leftArr.shift())
        } else {
            arr.push(rightArr.shift())
        }
    }

    if (leftArr.length) {
        arr.push(...leftArr)
    }
    if (rightArr.length) {
        arr.push(...rightArr)
    }

    return arr
}

let testArr = [32, 12, 56, 78, 76, 45, 36];
let arr = mergeSort(testArr);
console.log(arr);   // [12, 32, 36, 45, 56, 76, 78]