// 输入 '1, 2, 3, 5, 7, 8, 10' 输出 '1~3, 5, 7~8, 10'

function convert(arr) {

    let res = []
    let prev = arr[0]

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] - arr[i - 1] > 1) {
            if (prev !== arr[i - 1]) {
                res.push(`${prev}~${arr[i - 1]}`)
            } else {
                res.push(prev + '')
            }
            prev = arr[i]
        }
    }

    res.push(prev + '')

    return res
}

const nums1 = [1, 2, 3, 5, 7, 8, 10];

console.log(convert(nums1))