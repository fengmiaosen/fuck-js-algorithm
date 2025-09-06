// 将数组中的所有0移动到数组末尾，保持非零元素的相对顺序
// 要求在原数组上操作，不能拷贝新数组
// 尽量减少操作次数
// 输入 [0,1,0,3,13]
// 输出 [1,3,12,0,0]

function moveZero(arr) {

    let j = 0;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== 0) {
            [arr[j], arr[i]] = [arr[i], arr[j]];
            j++;
        }
    }

    return arr;
}

console.log(moveZero([0, 1, 0, 3, 13]));