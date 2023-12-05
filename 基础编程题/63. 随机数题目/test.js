
function getRandomIntInclusive(min, max) {
    let minValue = Math.ceil(min)
    let maxValue = Math.floor(max)

    return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
}

console.log(getRandomIntInclusive(0, 10))
