
// 递归法
function fn(value) {

    let lastNum = value % 10
    let restNum = Math.floor(value / 10)

    if (lastNum < 1) {
        return value
    } else {
        restNum = fn(restNum)

        return `${lastNum}${restNum}`
    }
}


console.log('reverse num:', fn(123456789));