// 使用迭代的方式实现 flatten 函数

/**
 * 将初始的数组元素压入栈
 * while循环中元素出栈，然后判断其类型，若是数组类型，则将其数组元素压入栈继续下一轮循环，直到栈为空
 * @param {*} arr 
 */
function flatten(arr) {
    const res = [];
    const stack = [...arr];

    while (stack.length) {
        const item = stack.shift();

        if (Array.isArray(item)) {
            stack.unshift(...item);
        } else {
            res.push(item);
        }
    }

    return res;
}

var arr = [1, 2, 3, [4, 5], [6, [7, [8, [10, 11, 13]]]]]


console.log('flatten arr:', flatten(arr));