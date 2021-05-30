// 二分查找搜索
// 要求被搜索的数据结构已经排好序

/**
 * 递归调用
设定区间,low和high
找出口： 找到target，返回target；
否则寻找，当前次序没有找到，把区间缩小后递归
 * @param {*} arr 
 * @param {*} value 
 * @param {*} low 
 * @param {*} high 
 */
function binarySearch(arr, value, low = 0, high = arr.length - 1) {
    const midIdx = Math.floor((low + high) / 2);
    const midValue = arr[midIdx];

    if (midValue === value) {
        return `找到了${value},在第${midIdx + 1}个`;
    } else {
        if (midValue > value) {
            return binarySearch(arr, value, low, midIdx - 1);
        } else if (midValue < value) {
            return binarySearch(arr, value, midIdx + 1, high);
        }
    }

    return -1;
}

/**
 * 非递归，循环方式二分查找特定值
 * @param {*} arr 
 * @param {*} value 
 */
function binarySearchLoop(arr, value) {
    let low = 0;
    let high = arr.length - 1;

    let midIdx;
    let midValue;

    while (low <= high) {
        midIdx = Math.floor((low + high) / 2);
        midValue = arr[midIdx];

        if (midValue === value) {
            return `找到了${value},在第${midIdx + 1}个`;
        } else if (midValue > value) {
            high = midIdx - 1;
        } else if (midValue < value) {
            low = midIdx + 1;
        }
    }

    return -1;
}

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33, 44]

console.log('binarysearch value:', binarySearch(arr, 8))

console.log('binarysearch value:', binarySearchLoop(arr, 22))