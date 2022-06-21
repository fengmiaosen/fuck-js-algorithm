
function curry(fn, ...args){
    if(args.length >= fn.length){
        return fn(...args)
    }

    return function(...params){
        return curry(fn, ...args, ...params)
    }
}


function add(x, y, z) {
    return (x + y + z)
}

let curryAdd = curry(add);

console.log(curryAdd(1)(2)(3));