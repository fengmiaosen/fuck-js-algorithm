let arr = [1, 3, 8, 4, 0, 12, 9];

function bubbleSort(list) {

    if (list.length < 1) {
        return list
    }

    const len = list.length

    for (let i = len - 1; i > 0; i--) {
        for (let j = 0; j < i; j++) {
            if (list[j] > list[j + 1]) {
                [list[j + 1], list[j]] = [list[j], list[j + 1]]
            }
        }
    }

    return list
}

console.log('bubble sort:', bubbleSort(arr))