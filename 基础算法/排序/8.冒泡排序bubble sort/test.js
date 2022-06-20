const arr = [1, 3, 2, 6, 4, 7, 9, 8, 10, 0];


function bubbleSort(arr) {

    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] > arr[j]) {
                [arr[j], arr[i]] = [arr[i], arr[j]]
            }
        }
    }

    return arr;
}


console.log('bubble sort:', bubbleSort(arr));