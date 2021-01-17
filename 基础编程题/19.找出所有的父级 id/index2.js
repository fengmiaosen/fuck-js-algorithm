// 已知数据格式，实现一个函数 fn ，找出某一节点所在链条中所有的父级 id
// 比如'112' 的父级id路径为 ['1', '11', '112']

const data = [{
    id: '1',
    name: 'test1',
    children: [
        {
            id: '11',
            name: 'test11',
            children: [
                {
                    id: '111',
                    name: 'test111'
                },
                {
                    id: '112',
                    name: 'test112'
                }
            ]

        },
        {
            id: '12',
            name: 'test12',
            children: [
                {
                    id: '121',
                    name: 'test121'
                },
                {
                    id: '122',
                    name: 'test122'
                }
            ]
        }
    ]
}];

function getParentIds(list, id) {

    for (let item of list) {
        if (item.id === id) {
            return [id]
        } else {
            if (item.children && item.children.length) {
                const ids = getParentIds(item.children, id)
                if (ids) {
                    return [item.id, ...ids]
                }
            }
        }
    }

}

console.dir(getParentIds(data, '12'), { depth: null })