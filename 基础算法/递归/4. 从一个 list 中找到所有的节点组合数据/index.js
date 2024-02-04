
// 元数组结构如下所示：
const list = [
    { id: 6 },
    { id: 2, children: [5] },
    { id: 13 },
    { id: 5, children: [10, 11] },
    { id: 1, children: [2, 3, 4] },
    { id: 10 },
    { id: 8, children: [13] },
    { id: 4, children: [8, 9] },
    { id: 9 },
    { id: 3, children: [6, 7] },
    { id: 11, children: [14] },
    { id: 14 },
    { id: 7, children: [12] },
    { id: 12 }
]

// 要求输出
// 数组中某个元素相当于根节点，其 children 数组记录的是其子节点的 id
// 要求从根节点出发，其所有子节点一直到没有 children 的叶子节点 id，记录在一个子数组中
// 最后输出所有的路径节点数组
// [ [1, 3, 6], [1, 4, 8, 13], ... ]


function fn(list) {
    let res = []

    let childList = list.filter(item => {
        return item.children?.length > 0
    }).map(t => t.children).flat()

    let root = list.filter(item => {
        return !childList.includes(item.id)
    })?.[0]


    let map = new Map()
    list.forEach(t => {
        map.set(t.id, t)
    })
    console.log('map===', map)


    let track = []
    let subTrack = [root.id]
    
    function dfs(arr, subTrack) {
        arr.map(t => {
            subTrack.push(t)
            let item = map.get(t)
            if (item.children?.length) {
                dfs(item.children, [...subTrack])
            } else {
                track.push([...subTrack])
            }
            subTrack.pop()
        })
    }

    console.log('root===', root)
    dfs(root.children, subTrack)

    console.log('track===', track)
    console.log('subTrack===', subTrack)

    return res
}

console.log(fn(list))