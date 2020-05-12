// 递归调用的过程中不断合并新旧参数，直到参数数量等于 fn定义的形参数量，既可结束递归
// 参考 https://juejin.im/post/5af13664f265da0ba266efcf

function curry(fn, ...args) {

    if (args.length >= fn.length) {
        return fn(...args);
    }

    return function (...params) {
        return curry(fn, ...args, ...params);
    }
}

function add(x, y, z) {
    return (x + y + z)
}

let curryAdd = curry(add);

console.log(curryAdd(1)(2)(3));