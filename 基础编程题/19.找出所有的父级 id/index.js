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

// 方法一：DFS 树的深度优先遍历
// 找到对应的节点，然后回溯其父级路径
function fn(list, id) {

    function _fn(nodeList) {
        for (let i = 0, len = nodeList.length; i < len; i++) {
            const node = nodeList[i]
            if (node.id == id) {
                return [node.id]
            }
            if (node.children && node.children.length) {
                const r = _fn(node.children)
                if (r) {
                    return [node.id].concat(r)
                }
            }
        }
    }

    return _fn(list)
}


/**
 * 方法二：DFS、栈、回溯
 * 典型的回溯算法（DFS)
 * @param {*} list 
 * @param {*} value 
 */
function findIds(list, value) {

    return dfs(list, value);
}

function dfs(list, value) {
    const stack = [...list];

    while (stack.length) {

        const cur = stack.pop();

        // 找到目标节点，递归结束
        if (cur.id === value) {
            return [cur.id];
        } else if (cur.children && cur.children.length) {
            const res = dfs(cur.children, value);

            if (res) {
                return [cur.id, ...res]
            }
        }

    }
}

const value = '112';

console.log('parent ids:', findIds(data, value));

