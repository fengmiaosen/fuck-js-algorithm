
function addStrs(str1, str2) {
    if (str1.length < 1 || str2.length < 1) {
        return str1 + str2
    }

    let m = str1.length - 1
    let n = str2.length - 1

    let carry = 0
    let res = []

    while (m >= 0 || n >= 0) {
        let v1 = str1[m] ? Number(str1[m]) : 0
        let v2 = str2[n] ? Number(str2[n]) : 0
        let sum = v1 + v2 + carry

        res.unshift(sum % 10)
        carry = Math.floor(sum / 10)

        m--
        n--
    }

    if (carry === 1) {
        res.unshift(1)
    }

    return res.join('')
}

console.log(addStrs('111', '2222'))
console.log(addStrs('8888888', '99999'))
