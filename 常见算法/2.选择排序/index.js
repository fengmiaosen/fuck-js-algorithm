function selectSort(arr) {

    let len = arr.length;

    for (let i = 0; i < len - 1; i++) {
        for (let j = i + 1; j < len; j++) {
            if (arr[i] > arr[j]) {
                [arr[i],arr[j]] = [arr[j], arr[i]];
            }
        }
    }

    return arr;
}

let arr = [1,3,8,4,0,5];

console.log('select sort:', selectSort(arr));