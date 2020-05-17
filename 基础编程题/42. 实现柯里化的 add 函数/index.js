// https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/134
// https://github.com/yygmind/blog/issues/37

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
 * 函数参数 length：获取的是形参的个数，但是形参的数量不包括剩余参数个数，而且仅包括第一个具有默认值之前的参数个数
 * @param {function} fn 
 * @param  {...any} args 
 */
function curry(fn, ...args) {

    if (args.length >= fn.length) {
        return fn.apply(this, args);
    }

    return (...rest) => {
        return curry(fn, ...args, ...rest)
    }
}

const curryAdd = curry(add);

console.log(curryAdd(1)(2));

console.log(curryAdd(1)(2)(3));

console.log(curryAdd(1, 2)(3));

console.log(curryAdd(1, 2, 3));