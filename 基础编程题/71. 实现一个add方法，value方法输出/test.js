
// add(1)(2,3)(4).value()   
// 输出： 10

function add(...args) {

    const fn = (...params) => {
        return add(...args, ...params)
    }

    fn.value = () => {
        return args.reduce((acc, cur) => acc + cur)
    }

    return fn;
}

console.log(add(1)(2, 3)(4)(5,6)(9).value())