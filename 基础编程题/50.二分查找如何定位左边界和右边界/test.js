
function findLeft(arr, target) {
    let left = 0;
    let right = arr.length - 1

    while (left <= right) {
        let mid = Math.floor((left + right) / 2)
        if (arr[mid] === target) {
            right = mid - 1
        } else if (arr[mid] > target) {
            right = mid - 1
        } else if (arr[mid] < target) {
            left = mid + 1
        }
    }

    return left
}

function findRight(arr, target) {
    let left = 0
    let right = arr.length - 1

    while (left <= right) {
        let mid = Math.floor((left + right) / 2)
        if (arr[mid] === target) {
            left = mid + 1
        } else if (arr[mid] > target) {
            right = mid - 1
        } else if (arr[mid] < target) {
            left = mid + 1
        }
    }
    return right
}

let arr = [1, 3, 4, 4, 6, 8, 10];

console.log('left bound:', findLeft(arr, 4))

console.log('right bound:', findRight(arr, 4))