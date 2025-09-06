// 如下：{1:222, 2:123, 5:888}，请把数据处理为如下结构：[222, 123, null, null, 888, null, null, null, null, null, null, null]。


var obj = { 1: 222, 2: 123, 5: 888 };

function fn(obj) {
    return new Array(12).fill(null).map((item, idx) => {
        return obj[idx + 1] || null
    });
}

function fn2(obj) {
    return Array.from({ length: 12 }).map((_, idx) => {
        return obj[idx + 1] || null
    });
}

console.log(fn(obj))