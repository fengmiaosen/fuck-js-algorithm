
let list = [
    { id: 1, name: '部门A', parentId: 0 },
    { id: 2, name: '部门B', parentId: 0 },
    { id: 3, name: '部门C', parentId: 1 },
    { id: 4, name: '部门D', parentId: 1 },
    { id: 5, name: '部门E', parentId: 2 },
    { id: 6, name: '部门F', parentId: 3 },
    { id: 7, name: '部门G', parentId: 2 },
    { id: 8, name: '部门H', parentId: 4 }
];


function convertList(arr) {

    const res = []
    const map = list.reduce((acc, cur) => {
        acc[cur.id] = cur;
        return acc;
    }, {});

    list.map(item => {
        if (item.parentId === 0) {
            res.push(item);
        } else {
            const parent = map[item.parentId]
            parent.children = parent.children || [];
            parent.children.push(item);
        }
    })

    return res;

}

console.log('conver:', JSON.stringify(convertList(list)))