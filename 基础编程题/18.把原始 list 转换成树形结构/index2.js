// 以下数据结构中，id 代表部门编号，name 是部门名称，parentId 是父部门编号，为 0 代表一级部门，现在要求实现一个 convert 方法，把原始 list 转换成树形结构，parentId 为多少就挂载在该 id 的属性 children 数组下，结构如下

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
// 转换后的结果如下
/* let result = [
    {
      id: 1,
      name: '部门A',
      parentId: 0,
      children: [
        {
          id: 3,
          name: '部门C',
          parentId: 1,
          children: [
            {
              id: 6,
              name: '部门F',
              parentId: 3
            }, {
              id: 16,
              name: '部门L',
              parentId: 3
            }
          ]
        },
        {
          id: 4,
          name: '部门D',
          parentId: 1,
          children: [
            {
              id: 8,
              name: '部门H',
              parentId: 4
            }
          ]
        }
      ]
    },
//   ···
]; */
function convert(list) {

  const map = list.reduce((acc, cur) => {
    acc[cur.id] = cur
    return acc
  }, {})

  let res = []

  list.forEach(el => {
    if (el.parentId === 0) {
      res.push(map[el.id])
    } else {
      const parent = map[el.parentId]
      parent.children = parent.children || []
      parent.children.push(el)
    }
  });

  return res
}

function convert2(list) {
  const map = new Map()
  const res = []

  list.forEach(item => {
    map.set(item.id, item)

    if (item.parentId === 0) {
      res.push(item)
    } else {
      const parent = map.get(item.parentId)
      parent.children = parent.children || []
      parent.children.push(item)
    }
  })

  return res

}

// console.dir(convert(list), { depth: null })

console.dir(convert2(list), { depth: null })