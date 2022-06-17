var arr = [8, 0, 1, 0, 3, 13, 0, 4];

function moveZero(arr) {
    // 慢指针，前面永远是非0数值
    let j = 0;

    // 快指针
    for (let i = 0; i < arr.length; i++) {

        if (arr[i] !== 0) {
            [arr[j], arr[i]] = [arr[i], arr[j]]
            j++
        }

    }

    return arr;
}

console.log('new arr:', moveZero(arr));