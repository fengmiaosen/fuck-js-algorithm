function bubbleSort(arr) {
    for (var i = 0, len = arr.length; i < len;  i++) {
         for (var j = i + 1;  j < len;  j++) {
              if (arr[i] > arr[j]) {
                   var temp = arr[i];
                   arr[i] = arr[j];
                   arr[j] = temp;
              }
         }
    }
    return arr;
}

let arr = [1,3,8,4,0];

console.log('bubble sort:', bubbleSort(arr));