
function quickSort(arr) {
    if (arr.length < 2) {
        return arr
    }


    let midIdx = Math.floor(arr.length / 2)
    let midValue = arr.splice(midIdx, 1)[0]

    let leftArr = []
    let rightArr = []

    for (let item of arr) {
        if (item < midValue) {
            leftArr.push(item)
        } else {
            rightArr.push(item)
        }
    }

    let leftList=quickSort(leftArr)
    let rightList=quickSort(rightArr)

    return [...leftList, midValue, ...rightList]

}

let testArr = [32, 12, 56, 78, 76, 45, 36];
let arr = quickSort(testArr);
console.log(arr);   // [12, 32, 36, 45, 56, 76, 78]

