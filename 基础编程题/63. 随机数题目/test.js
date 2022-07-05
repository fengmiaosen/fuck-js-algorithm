
// 随机整数，可以包括min，max
function getRandomNumber(min, max) {

    let minNum = Math.ceil(min)
    let maxNum = Math.floor(max)

    return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum
}

console.log('random num:', getRandomNumber(1, 18))