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

function findPath(list, id) {

    function dfs(arr) {

        for (let item of arr) {
            if (item.id === id) {
                return [id]
            } else {
                if (item.children?.length) {
                    let res = dfs(item.children)
                    if (res) {
                        return [item.id, ...res]
                    }
                }
            }
        }
    }

    return dfs(list)
}

console.log(findPath(data, '122'))