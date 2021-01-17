
var arr = [2, 10, 3, 4, 5, 11, 10, 11, 20, 21, 30, 40];

/**
 * 
 * @param {array} arr 
 */
function splitArray(arr) {

    arr.sort((a, b) => a - b)

    arr = [...new Set(arr)]

    const res = []
    let subArr = []
    let i = 0

    for (i = 0; i < arr.length - 1; i++) {
        if (arr[i + 1] - arr[i] === 1) {
            subArr.push(arr[i])
        } else {
            subArr.push(arr[i])
            res.push(subArr)
            subArr = []
        }
    }

    subArr.push(arr[i])
    res.push(subArr)

    return res;
}

function splitArray2(arr) {

    arr.sort((a, b) => a - b)

    arr = [...new Set(arr)]

    const res = []
    let subArr = [arr[0]]
    let i

    for (i = 1; i < arr.length; i++) {
        if (arr[i] - arr[i - 1] === 1) {
            subArr.push(arr[i])
        } else {
            res.push(subArr)
            subArr = [arr[i]]
        }
    }

    res.push(subArr)

    return res;
}

console.log('array split:', splitArray(arr))

console.log('array split 2:', splitArray2(arr))
