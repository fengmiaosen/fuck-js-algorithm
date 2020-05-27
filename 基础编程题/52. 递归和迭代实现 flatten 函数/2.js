
/**
 * 递归实现数组flatten
 * @param {number[]} arr 
 */
function flatten(arr) {
    let res = [];

    arr.forEach(item => {
        if(Array.isArray(item)){
            res.push(...flatten(item))
        }else{
            res.push(item);
        }
    });

    return res;
}

var arr = [1, 2, 3, [4, 5], [6, [7, [8, [10, 11, 13]]]]]


console.log('flatten arr:', flatten(arr));