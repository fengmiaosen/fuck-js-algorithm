// 冒泡排序的原理
//   从第一个数开始，依次往后比较，如果前面的数比后面的数大就交换，否则不作处理。这就类似烧开水时，壶底的水泡往上冒的过程。

//   冒泡排序分从大到小和从小到大两种排序方式。它们的唯一区别就是两个数交换的条件不同，从大到小排序是前面的数比后面的小的时候交换，而从小到大排序是前面的数比后面的数大的时候交换。我这里只说 从小到大的排序方式。
// ————————————————
// 版权声明：本文为CSDN博主「渣媛」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
// 原文链接：https://blog.csdn.net/zcl_love_wx/article/details/83576962


function bubbleSort(arr) {

    for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[i] > arr[j]) {
                [arr[j], arr[i]] = [arr[i], arr[j]]
            }
        }
    }

    return arr;
}

var arr = [1, 3, 2, 6, 4, 7, 9, 8, 10, 5];

console.log('bubble sort:', bubbleSort(arr));
