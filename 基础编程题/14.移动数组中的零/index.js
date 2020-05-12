// 将数组中的所有0移动到数组末尾，保持非零元素的相对顺序
// 要求在原数组上操作，不能拷贝新数组
// 尽量减少操作次数
// 输入 [0,1,0,3,13]
// 输出 [1,3,12,0,0]

// 方法一
function moveZero(arr) {

    var len = arr.length;
    var j = 0;

    for (var i = 0; i < len - j; i++) {
        if(arr[i] === 0){
            arr.push(0);
            arr.splice(i,1);
            i--;
            j++;
        }
    }

    return arr;
}

var arr = [0,1,0,3,13];

console.log('new arr:', moveZero(arr));
