
function splitArray(arr) {

    arr = [...new Set(arr)]

    arr.sort((a, b) => a - b)

    let res = []
    let subArr = [arr[0]]

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] - arr[i - 1] === 1) {
            subArr.push(arr[i])
        } else {
            res.push(subArr)
            subArr = [arr[i]]
        }
    }

    res.push(subArr)

    return res
}

let arr = [2, 10, 3, 4, 5, 11, 10, 11, 20, 24]

console.log(splitArray(arr))