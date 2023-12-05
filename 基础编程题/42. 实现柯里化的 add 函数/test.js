
// 实现一个add函数：

// console.log(add(1,2,3)(1)(2)(3)(4,5,6)(7,8)()) //输出是 52

function sumValue(arr) {
    return arr.reduce((acc, cur) => {
        return acc + cur
    })
}

function add(...args) {
    let sum = sumValue(args)

    return function fn(...params) {
        if (params.length > 0) {
            sum += sumValue(params)
            return fn
        } else {
            return sum
        }
    }
}

console.log(add(1, 2, 3)(1)(2)(3)(4, 5, 6)(7, 8)(10)())