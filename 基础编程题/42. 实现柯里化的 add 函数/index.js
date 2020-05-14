// https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/134
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
 * @param {function} fn 
 * @param  {...any} args 
 */
function curry(fn, ...args) {

    if (args.length >= fn.length) {
        return fn.apply(this, args);
    }

    return function () {
        return curry(fn, ...args, ...arguments)
    }
}

const curryAdd = curry(add);

console.log(curryAdd(1)(2)(3));

console.log(curryAdd(1, 2)(3));

console.log(curryAdd(1, 2, 3));