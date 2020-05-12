function bubbleSort(arr) {

    let len = arr.length;

    for (let i = len; i >= 2; i--) {
        for (let j = 0; j < len - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }

    return arr;
}

let arr = [1,3,8,4,0];

console.log('bubble sort:', bubbleSort(arr));
