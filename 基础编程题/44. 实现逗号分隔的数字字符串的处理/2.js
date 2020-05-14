var str = '1,2,3,5,7,8,10,20,30,31';


function func(str) {

    if (str.length < 1) {
        return [];
    }

    const arr = str.split(',');

    let res = [];
    let subRes = [];

    //慢指针，指向不连续的起始数组元素
    let j = 0;

    //快指针，指向当前元素
    let i = 1;

    for (; i < arr.length; i++) {
        if (arr[i] - arr[i - 1] > 1) {
            subRes = getRange(arr, j, i - 1);
            res.push(subRes);

            j = i;
        }
    }

    // 遍历结束后，记得要获取慢指针到数组末尾之间的元素
    res.push(getRange(arr, j, i - 1));

    return res;
}

function getRange(arr, start, end) {
    let subRes = '';

    if (end - start == 0) {
        subRes = arr[start];
    } else if (end - start > 0) {
        subRes = [arr[start], '~', arr[end]].join('');
    }

    return subRes;
}

console.log(func(str));