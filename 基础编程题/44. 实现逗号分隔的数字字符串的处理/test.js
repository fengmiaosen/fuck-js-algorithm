// 输入 '1, 2, 3, 5, 7, 8, 10' 输出 '1~3, 5, 7~8, 10'

const nums1 = [1, 2, 3, 5, 7, 8, 10];

function convert(arr) {
    let arr1 = arr.sort((a, b) => a - b)
    let list = [...new Set(arr1)]

    let res = []
    let temp = list[0]

    for (let i = 1; i < list.length; i++) {
        if (list[i] - list[i - 1] > 1) {
            if(list[i-1] !== temp){
                res.push(`${temp}~${list[i-1]}`)
            }else{
                res.push(temp + '')
            }
            temp = list[i]
        }
    }

    return res;
}

console.log('nums str:', convert(nums1));