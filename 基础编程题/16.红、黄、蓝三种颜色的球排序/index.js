// 在一个字符串数组中有红、黄、蓝三种颜色的球，且个数不相等、顺序不一致，请为该数组排序。使得排序后数组中球的顺序为:黄、红、蓝。

// 例如：红蓝蓝黄红黄蓝红红黄红，排序后为：黄黄黄红红红红红蓝蓝蓝。

function getNumByType(type) {
    switch (type) {
        case '黄':
            return 1
        case '红':
            return 2
        default:
            return 3
    }
}

function sortBalls(str) {
    let arr = str.split('')
    arr.sort((a, b) => {
        return getNumByType(a) - getNumByType(b)
    })

    return arr.join('')
}

 var strs = '红蓝蓝黄红黄蓝红红黄红';

 console.log('sort:', sortBalls(strs));
 