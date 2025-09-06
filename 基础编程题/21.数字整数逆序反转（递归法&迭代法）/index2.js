// https://leetcode-cn.com/problems/reverse-integer/description/

function reverse(num) {
    if (num === 0) {
        return 0
    }

    let res = 0

    while (num !== 0) {
        // 通过求余获取最后一位数字
        let pop = num % 10

        // 边界判断
        if (res > Math.pow(2, 31) / 10) {
            return 0
        }
        if (res < Math.pow(-2, 31) / 10) {
            return 0
        }

        res = res * 10 + pop

        // 除以10，去掉最后一位
        num = Math.floor(num / 10)
    }

    return res
}


console.log('reverse num:', reverse(123456789));