
function quickSort(arr) {

    if (arr.length < 2) {
        return arr;
    }

    let midIndex = Math.floor(arr.length / 2);
    let midValue = arr.splice(midIndex, 1)[0];

    let leftArr = [];
    let rightArr = [];

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < midValue) {
            leftArr.push(arr[i]);
        } else {
            rightArr.push(arr[i])
        }
    }

    return quickSort(leftArr).concat([midValue]).concat(quickSort(rightArr));
}


let arr = [1,3,8,4,0,20,111,6,9,34,68];

console.log('quick sort:', quickSort(arr));