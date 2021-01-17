
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

/**
 * 基本思路：
 * 使用Map保存id和对象的映射
 * 循环list，根据parentId在Map里取得父节点，如果父节点有children属性，就直接push当前的子节点
 * 如果没有就添加children属性，最后遍历一遍list把parentId===0的节点取出来。
 * @param {array} list 
 */
function convertStr(list) {
    const res = [];

    //先遍历一遍将数组转换为id为键的map
    const map = new Map();

    for (let i = 0; i < list.length; i++) {
        map.set(list[i].id, list[i]);
    }

    for (let item of list) {
        if (item.parentId == 0) {
            res.push(item);
        } else {
            const pItem = map.get(item.parentId);
            pItem.children = pItem.children || [];
            pItem.children.push(item);
        }
    }

    return res;
}

/**
 * 方法二：一次遍历
 * @param {*} list 
 */
function convert2(list) {
    const res = [];

    //先遍历一遍将数组转换为id为键的map
    const cacheMap = new Map();

    for (let item of list) {
        cacheMap.set(item.id, item);

        if (item.parentId == 0) {
            res.push(item);
        } else {
            const pItem = cacheMap.get(item.parentId);
            pItem.children = pItem.children || [];
            pItem.children.push(item);
        }
    }

    return res;
}

// console.log('convert list:', JSON.stringify(convert(list)))

console.log('convert list:', JSON.stringify(convert2(list)))