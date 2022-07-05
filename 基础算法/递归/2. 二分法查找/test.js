const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33, 44]

function binarySearch(arr, target) {
    let left = 0
    let right = arr.length - 1

    while (left <= right) {
        // let midIdx = Math.floor((left + right) / 2)
        // 避免数值相加溢出
        let midIdx = Math.floor((right - left) / 2 + left)

        if (arr[midIdx] > target) {
            right = midIdx - 1
        } else if (arr[midIdx] === target) {
            return midIdx
        } else {
            left = midIdx + 1;
        }
    }

    return -1;
}

console.log('binarysearch value:', binarySearch(arr, 8))