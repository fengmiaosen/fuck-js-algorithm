function quickSort(arr) {
    // Fix: Create a copy to avoid mutating the original array
    const array = [...arr];
    
    if (array.length <= 1) {
        return array;
    }

    // Fix: Use a more efficient pivot selection and avoid splice
    const pivotIndex = Math.floor(array.length / 2);
    const pivot = array[pivotIndex];
    
    const leftArr = [];
    const rightArr = [];
    const equalArr = []; // Handle duplicates efficiently

    for (let i = 0; i < array.length; i++) {
        if (i === pivotIndex) {
            equalArr.push(array[i]);
        } else if (array[i] < pivot) {
            leftArr.push(array[i]);
        } else {
            rightArr.push(array[i]);
        }
    }

    // 分别对左右两个数组部分递归调用
    // 并和中间值合并
    const leftRes = quickSort(leftArr);
    const rightRes = quickSort(rightArr);

    return leftRes.concat(equalArr).concat(rightRes);
}

let testArr = [32,12,56,78,76,45,36];
let arr = quickSort(testArr);
console.log(arr);   // [12, 32, 36, 45, 56, 76, 78]
console.log('Original array unchanged:', testArr); // Original array should remain unchanged