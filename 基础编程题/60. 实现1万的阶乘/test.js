
function multiply(num1, num2) {
    num1 = num1.toString()
    num2 = num2.toString()

    let m = num1.length
    let n = num2.length

    let res = new Array(m + n).fill(0)

    for (let i = m - 1; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
            let value = Number(num1[i]) * Number(num2[j])

            let highIdx = i + j
            let lowIdx = i + j + 1

            let sum = res[lowIdx] + value

            res[lowIdx] = sum % 10
            res[highIdx] = res[highIdx] + parseInt(sum / 10)
        }
    }

    console.log('res:', res)

    if (res[0] === 0) {
        res.shift()
    }

    return res.join('')

}

console.log(multiply(123456, 456789))