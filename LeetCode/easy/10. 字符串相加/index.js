// 给定两个字符串形式的非负整数 num1 和 num2 ，计算它们的和。

// 例如：

// "111" + ”2222“ = ”2333“

// 注意：

// num1 和 num2 的长度都小于 5100
// num1 和 num2 都只包含数字 0-9
// num1 和 num2 都不包含任何前导零
// 你不能使用任何內建 BigInteger 库， 也不能直接将输入的字符串转换为整数形式
// 上代码

/**
 * 
 * @param {string} str1 
 * @param {string} str2 
 * @returns 
 */
function addStrs(str1, str2) {

    if (str1.length < 1 || str2.length < 1) {
        return str1 + str2
    }

    let m = str1.length - 1
    let n = str2.length - 1

    let res = []
    let carry = 0

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

/**
 * 
 * @param {string} num1 
 * @param {string} num2 
 * @returns 
 */
function addStrs2(num1, num2) {

    if (num1.length < 1 || num2.length < 1) {
        return num1 + num2
    }

    let m = num1.length - 1
    let n = num2.length - 1

    let res = []
    let carry = 0

    for (; m >= 0 || n >= 0; m--, n--) {
        let v1 = num1[m] ? Number(num1[m]) : 0
        let v2 = num2[n] ? Number(num2[n]) : 0

        let sum = v1 + v2 + carry

        res.unshift(sum % 10)
        carry = Math.floor(sum / 10)
    }

    if (carry === 1) {
        res.unshift(1)
    }

    return res.join('')
}


console.log(addStrs('111', '2222'))
console.log(addStrs2('111', '2222'))