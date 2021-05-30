let arr = [1, 3, 8, 4, 0, 20, 111, 6, 9, 34, 68];

function quickSort(list) {
    if (list.length < 1) {
        return []
    }

    let idx = Math.floor(list.length / 2)
    let midValue = list.splice(idx, 1)[0]

    let leftArr = []
    let rightArr = []

    for (let i = 0; i < list.length; i++) {
        if (list[i] < midValue) {
            leftArr.push(list[i])
        } else {
            rightArr.push(list[i])
        }
    }

    return quickSort(leftArr).concat([midValue]).concat(quickSort(rightArr))

}

console.log('quick sort:', quickSort(arr))