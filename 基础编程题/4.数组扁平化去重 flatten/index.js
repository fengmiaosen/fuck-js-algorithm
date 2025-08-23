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


/**
 * 递归实现数组flatten
 * @param {number[]} arr 
 */
 function flatten2(arr) {
    let res = [];

    arr.forEach(item => {
        if (Array.isArray(item)) {
            res.push(...flatten2(item))
        } else {
            res.push(item);
        }
    });

    return res;
}

var arr = [1, 2, 3, [4, 5], [6, [7, [8, [10, 11, 13]]]]]


console.log('flatten arr2:', flatten2(arr));