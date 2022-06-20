// 请把两个数组 
// ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'] 
// 和 ['A', 'B', 'C', 'D']
// 合并为 ['A1', 'A2', 'A', 'B1', 'B2', 'B', 'C1', 'C2', 'C', 'D1', 'D2', 'D']


var arr1 = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D'];
var arr2 = ['A', 'B', 'C'];


function mergetArray(arr1, arr2) {
    const list1 = [...arr1, ...arr2]
    //  默认排序以字符串第一个字符的ASCII码为标准，结果为相同首字母的字符串相邻
    const list2 = list1.sort();

    // 对于相同首字母的字符串，按照字符串长度来比较
     list2.sort((a, b) => {
        if (a[0] === b[0] && a.length < b.length) {
            return -1;
        } else {
            return 1
        }
    })

    return list2;

}

console.log('arr res:', mergetArray(arr1, arr2));
