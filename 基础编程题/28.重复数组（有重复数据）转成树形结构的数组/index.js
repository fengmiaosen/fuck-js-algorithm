// 如何将[{id: 1}, {id: 2, pId: 1}, ...] 的重复数组（有重复数据）转成树形结构的数组 [{id: 1, child: [{id: 2, pId: 1}]}, ...] （需要去重）
// 相似题目 https://muyiy.cn/question/program/88.html

function transformTree(arr){
    const res = [];

    // 以id为key构建hashMap
    const hashMap = arr.reduce((acc, cur) => {
        acc[cur.id] = cur;
        return acc;
    }, {});
    // 或者可以简写为
    // const hashMap = arr.reduce((acc, cur) => (acc[cur.id]=cur, acc), {});

    for(let item of Object.values(hashMap)){
        if(!item.pId){
            res.push(item);
        } else {
            const parentItem = hashMap[item.pId];
            parentItem.child = parentItem.child || [];
            parentItem.child.push(item);
        }
    }

    return res;
}

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

  const result = transformTree(arr);

  console.log('arr tree:', JSON.stringify(result));