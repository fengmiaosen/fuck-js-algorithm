// 使用迭代的方式实现 flatten 函数

/**
 * 其本质实现思想就是
 * 树的广度优先遍历 BFS
 * 
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