// 请实现一个 add 函数，满足以下功能。
// add(1); 			// 1
// add(1)(2);  	// 3
// add(1)(2)(3)；// 6
// add(1)(2, 3); // 6
// add(1, 2)(3); // 6
// add(1, 2, 3); // 6

function add(x, y, z) {
    return x + y + z;
}

/**
 * 
 * @param {Function} fn 
 * @param  {...any} args 
 * @returns 
 */
function curry(fn, ...args){
    if(args.length >= fn.length){
        return fn.apply(this, args)
    }

    return (...params) => {
        return curry(fn, ...args, ...params)
    }
}

const curryAdd = curry(add);

console.log('curryAdd:', curryAdd)

console.log(curryAdd(1)(2));

console.log(curryAdd(1)(2)(3));

console.log(curryAdd(1, 2)(3));

console.log(curryAdd(1, 2, 3));