//将数组扁平化并去重，最终得到一个升序不重复的数组

var arr = [
    [1,2,2],
    [3,4,5,5],
    [6,7,8,9,[11,12,[12,13,[14]]]]
];

//方法一
function setArr(arr){

    let resArr = [];

    resArr = arr.toString().split(',').sort((a,b) => {return a-b});

    return [...new Set(resArr)];
}

console.log('arr1:', setArr(arr));

// 方法二
// 拍平
function flat(arr){
    let resArr = [];

    arr.forEach(item => {
        if(Array.isArray(item)){
            resArr = resArr.concat(flat(item));
        } else {
            resArr.push(item);
        }
    });

    return resArr;
}

// 去重
function uniq(arr){
    return [...new Set(arr)];
}

console.log('arr2:', uniq(flat(arr)));
