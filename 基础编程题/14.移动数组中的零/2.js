
// 快慢双指针
// 慢指针 之前的所有元素都是非零的。
// 慢指针 和当前指针（快指针）之间的所有元素都是零
function moveZero(arr) {
    // 慢指针
    let j = 0;

    // 快指针遍历当前元素
    for (let i = 0; i < arr.length; i++) {

        if(arr[i] !== 0){
            [arr[j], arr[i]] = [arr[i], arr[j]];
            j++;
        }
    }

    return arr;
}

var arr = [8, 0, 1, 0, 3, 13, 0, 4];

console.log('new arr:', moveZero(arr));