// 实现一个add方法
// 例如：

// add(1)(2,3)(4).value()   
// 输出： 10

const add = (...args) => {
    const _add = (...args1) => {
        return add(...args, ...args1)
    }
    
    _add.value = () => args.reduce((t, e) => t + e)

    return _add
}

console.log(add(1)(2, 3)(4).value())