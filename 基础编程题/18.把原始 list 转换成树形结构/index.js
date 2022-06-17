// 以下数据结构中，id 代表部门编号，name 是部门名称，parentId 是父部门编号，为 0 代表一级部门，现在要求实现一个 convert 方法，把原始 list 转换成树形结构，parentId 为多少就挂载在该 id 的属性 children 数组下，结构如下

// 原始 list 如下
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

/**
 * 方法一
 * @param {*} list 
 */
function convert1(list) {
  const res = []
  const map = list.reduce((res, v) => (res[v.id] = v, res), {})
  console.log('list map:', map)

  for (const item of list) {
    if (item.parentId === 0) {
      res.push(item)
      continue
    }
    if (item.parentId in map) {
      const parent = map[item.parentId]
      parent.children = parent.children || []
      parent.children.push(item)
    }
  }
  return res
}

/**
 * 方法二
 * 基于DFS 深度优先遍历
 * @param {*} source 
 * @param {*} parentId 
 */
function convertStr(source, parentId = 0) {
  let trees = [];
  for (let item of source) {
    if (item.parentId === parentId) {
      let children = convertStr(source, item['id']);
      if (children.length) {
        item.children = children
      }
      trees.push(item);
    }
  }
  return trees;
}

// 方法三：
// 一次循环解决
function convert3(list) {

  const cache = new Map()

  return list.reduce((res, cur) => {
    const { id, parentId } = cur
    const item = { ...cur }

    if (parentId === 0) {
      res.push(item)
    } else {
      const itemCache = cache.get(parentId)
      !itemCache.children && (itemCache.children = [])
      itemCache.children.push(item)
    }
    cache.set(id, item)
    return res
  }, []);
}


const result1 = convert1(list);
const result2 = convertStr(list);
const result3 = convert3(list);

console.log('convert 1:', result1);
// console.log('convert 2:', result2);
// console.log('convert 3:', result3);