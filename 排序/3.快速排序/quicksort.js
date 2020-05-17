function quickSort(arr) {

    if (arr.length <= 1) {
        return arr;
    }

    let midIndex = Math.floor(arr.length / 2);
    let midValue = arr.splice(midIndex, 1)[0];

    let leftArr = [];
    let rightArr = [];

    for (let i = 0; i < arr.length; i++) {
        if(arr[i]<midValue){
            leftArr.push(arr[i]);
        } else {
            rightArr.push(arr[i]);
        }
    }

    // 分别对左右两个数组部分递归调用并和中间值合并
    let leftRes = quickSort(leftArr);
    let rightRes = quickSort(rightArr);

    return leftRes.concat([midValue]).concat(rightRes);
}

let testArr = [32,12,56,78,76,45,36];
let arr = quickSort(testArr);
console.log(arr);   // [12, 32, 36, 45, 56, 76, 78]