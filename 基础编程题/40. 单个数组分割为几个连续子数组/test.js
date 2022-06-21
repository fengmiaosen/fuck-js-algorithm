// [2, 10, 3, 4, 5, 11, 10, 11, 20]，将其排列成一个新数组
// 要求新数组形式如下，例如 [[2, 3, 4, 5], [10, 11], [20]]
// 相邻数字放置到同一个子数组中

var arr = [2, 10, 3, 4, 5, 11, 10, 11, 20]

function splitArray(arr) {
    let arr1 = arr.sort((a, b) => a - b)

    let arr2 = [...new Set(arr1)]

    let subArr = [arr2[0]]
    let res = []

    for (let i = 1; i < arr2.length; i++) {
        if (arr2[i] - arr2[i - 1] === 1) {
            subArr.push(arr2[i])
        } else {
            res.push(subArr)
            subArr = [arr2[i]]
        }
    }

    res.push(subArr)

    return res
}

console.log('array split:', splitArray(arr))