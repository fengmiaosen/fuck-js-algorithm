//  方法一
function twoSum(list, total) {

    let map = {}

    for (let i = 0; i < list.length; i++) {
        let res = total - list[i]
        if (map[res]) {
            return [map[res], i]
        } else {
            map[list[i]] = i
        }
    }
}

// 方法二
function two(arr, total) {
    let map = new Map()

    for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        let res = total - item;

        if (map.has(res)) {
            return [map.get(res), i]
        }

        map.set(item, i);
    }
}

console.log(twoSum([2, 7, 11, 15, 20], 27))
console.log(two([2, 7, 11, 15, 20], 26))