
var arr = [2, 10, 3, 4, 5, 11, 10, 11, 20];


function splitArray(arr) {

    // 排序
    arr = arr.sort((a, b) => a - b);

    // 去重
    arr = [...new Set(arr)];

    const res = [];

    let subRes = [arr[0]];

    //两种循环方式效果等同

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] - arr[i - 1] === 1) {
            subRes.push(arr[i]);
        } else {
            res.push(subRes);

            // 子数组重置，从当前不连续的元素开始
            subRes=[arr[i]];
        }
    }

    // for(let i=0;i<arr.length-1;i++){
    //     if(arr[i+1] - arr[i] === 1){
    //         subRes.push(arr[i+1]);
    //     }else{
    //         res.push(subRes);
    //         subRes=[arr[i+1]];
    //     }
    // }

    res.push(subRes);

    return res;
}

console.log('array split:', splitArray(arr))