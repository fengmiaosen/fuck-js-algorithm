// 将数组中的所有0移动到数组末尾，保持非零元素的相对顺序
// 要求在原数组上操作，不能拷贝新数组
// 尽量减少操作次数
// 输入 [0,1,0,3,13]
// 输出 [1,3,12,0,0]

function moveZero(arr) {
    let i = 0;
    let j = 0;

    while (i < arr.length) {
        if (arr[i] !== 0) {
            [arr[i], arr[j]] = [arr[j], arr[i]]
            j++
        }
        i++
    }

    return arr
}

console.log(moveZero([0, 1, 0, 3, 13]))