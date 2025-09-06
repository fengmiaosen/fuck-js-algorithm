/**
 * 选择排序
 * 选择排序是一种简单直观的排序算法，无论什么数据进去都是 O(n²) 的时间复杂度。所以用到它的时候，数据规模越小越好。
 * 唯一的好处可能就是不占用额外的内存空间了吧。
 * 选择排序的工作原理：首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置，
 * 然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。
 * 以此类推，直到所有元素均排序完毕。
 * @param {Array} arr 待排序数组
 * @returns {Array} 排序后的数组
 */
function selectSort(arr) {

    let len = arr.length;

    for (let i = 0; i < len - 1; i++) {
        for (let j = i + 1; j < len; j++) {
            if (arr[i] > arr[j]) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
    }

    return arr;
}

let arr = [1, 3, 8, 4, 0, 5];

console.log('select sort:', selectSort(arr));