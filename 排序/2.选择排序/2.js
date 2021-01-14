let arr = [1, 3, 8, 4, 0, 5];

function selectionSort(list) {

    for (let i = 0; i < list.length - 1; i++) {
        for (let j = i + 1; j < list.length; j++) {
            if (list[i] > list[j]) {
                [list[j], list[i]] = [list[i], list[j]]
            }
        }
    }

    return list
}

console.log('select sort:', selectionSort(arr))