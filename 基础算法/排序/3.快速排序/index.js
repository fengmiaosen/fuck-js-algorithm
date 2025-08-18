function quickSort(arr) {
    // Create a copy to avoid modifying the original array
    let workingArr = [...arr];

    if (workingArr.length <= 1) {
        return workingArr;
    }

    let midIndex = Math.floor(workingArr.length / 2);
    let midValue = workingArr[midIndex];  // Fixed: Use direct access instead of splice

    let leftArr = [];
    let rightArr = [];

    // Fixed: Iterate through all elements including the pivot
    for (let i = 0; i < workingArr.length; i++) {
        if (i === midIndex) continue;  // Skip the pivot element
        if(workingArr[i] < midValue){
            leftArr.push(workingArr[i]);
        } else {
            rightArr.push(workingArr[i]);
        }
    }

    // 分别对左右两个数组部分递归调用
    // 并和中间值合并
    let leftRes = quickSort(leftArr);
    let rightRes = quickSort(rightArr);

    return leftRes.concat([midValue]).concat(rightRes);
}

let testArr = [32,12,56,78,76,45,36];
let arr = quickSort(testArr);
console.log(arr);   // [12, 32, 36, 45, 56, 76, 78]