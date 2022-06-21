function sum(args) {

    return args.reduce((acc, cur) => {
        return acc + cur;
    }, 0)
}


function add(...args) {
    let sumValue = sum(args)

    return function fn(...params) {
        if (params.length) {
            sumValue += sum(params)
            return fn
        } else {
            return sumValue;
        }
    }
}


let res = add(1, 2, 3)(1)(2)(3)(4, 5, 6)(7, 8)(10)()
console.log(res)