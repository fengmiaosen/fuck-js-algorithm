// 测试数据
const testArray = [
    [1, 2, 2],
    [3, 4, 5, 5, 20, [[90]]],
    [6, 7, 8, 9, [11, 12, [12, 13, [14]]]]
];

// 递归
function flattenRecursive(arr) {
    return arr.reduce((acc, cur) => {
        return acc.concat(Array.isArray(cur) ? flattenRecursive(cur) : cur);
    }, []);
}

// 队列
function flattenQueue(arr) {
    const result = [];
    const queue = [...arr];

    while (queue.length) {
        const item = queue.shift();
        if (Array.isArray(item)) {
            queue.push(...item);
        } else {
            result.push(item);
        }
    }

    return result;
}

console.log(flattenRecursive(testArray));

console.log(flattenQueue(testArray));