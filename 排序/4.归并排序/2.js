var testArr = [32, 12, 56, 78, 76, 45, 36, 13, 4, 9];

function mergeSort(list) {
    if (list.length < 2) {
        return list
    }

    const midIndex = Math.floor(list.length / 2)
    const leftArr = list.slice(0, midIndex)
    const rightArr = list.slice(midIndex)

    return merge(mergeSort(leftArr), mergeSort(rightArr))
}

/**
 * 合并两个有序数组
 * @param {*} leftArr 
 * @param {*} rightArr 
 */
function merge(leftArr, rightArr) {
    let res = []

    while (leftArr.length > 0 && rightArr.length > 0) {
        if (leftArr[0] < rightArr[0]) {
            res.push(leftArr.shift())
        } else {
            res.push(rightArr.shift())
        }
    }

    res = [...res, ...leftArr, ...rightArr]

    return res
}

console.log('merge sort:', mergeSort(testArr))
