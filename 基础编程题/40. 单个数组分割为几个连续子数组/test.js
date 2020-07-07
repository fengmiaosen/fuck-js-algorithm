var arr = [2, 10, 3, 4, 5, 11, 10, 11, 20];

function groupArray(arr) {

    arr.sort((a, b) => a - b);

    arr = [...new Set(arr)];

    let res = [];
    let subRes = [arr[0]];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] - arr[i - 1] == 1) {
            subRes.push(arr[i]);
        } else {
            res.push([...subRes]);
            subRes = [arr[i]];
        }
    }

    res.push(subRes);

    return res;
}

console.log('arr group:', groupArray(arr));