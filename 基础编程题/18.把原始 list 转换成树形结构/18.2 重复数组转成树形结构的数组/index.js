// 如何将[{id: 1}, {id: 2, pId: 1}, ...] 的重复数组（有重复数据）转成树形结构的数组 [{id: 1, child: [{id: 2, pId: 1}]}, ...] （需要去重）
// 相似题目 https://muyiy.cn/question/program/88.html

const arr = [
    { id: 1, pId: null },
    { id: 2, pId: 1 },
    { id: 3, pId: 1 },
    { id: 4, pId: 2 },
    { id: 5, pId: 2 },
    { id: 6, pId: 3 },
    { id: 7, pId: 3 },
    { id: 8, pId: 3 },
    { id: 9, pId: 8 },
    { id: 10, pId: 6 }
];

function transform(arr) {

    const res = [];

    //先遍历数组生成以id为键的hashmap，方便后面根据id获取数据
    const map = arr.reduce((acc, cur) => {
        acc[cur.id] = cur;
        return acc;
    }, {});

    for (let item of arr) {
        if (!item.pId) {
            res.push(item);
        } else {
            const pItem = map[item.pId];
            pItem.children = pItem.children || [];
            pItem.children.push(item);
        }
    }

    return res;

}

const arrTree = transform(arr);

console.log('tree data:', JSON.stringify(arrTree));