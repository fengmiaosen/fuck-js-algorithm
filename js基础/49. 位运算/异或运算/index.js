// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
// 按位异或（XOR）	a ^ b	
// 对于每一个比特位，当两个操作数相应的比特位有且只有一个1时，结果为1，否则为0。

// 数组中只出现一次的数字
let arr = [1, 2, 3, 4, 3, 2, 1]
const p = arr.reduce((a, b) => {
    return a ^ b
})

console.log('只出现一次的数字:', p)