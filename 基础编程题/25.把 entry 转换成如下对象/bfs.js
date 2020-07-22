//bfs 广度优先遍历
// 层次遍历

function flatObj(entry) {
    const queue = Object.entries(entry)
    const res = {}
    while (queue.length) {
        const [key, obj] = queue.shift()
        for (const [k, v] of Object.entries(obj)) {
            if (typeof v !== 'object') {
                res[`${key}.${k}`] = v
            } else {
                queue.push([`${key}.${k}`, v])
            }
        }
    }
    return res
}

var entry = {
    a: {
        b: {
            c: {
                dd: 'abcdd'
            }
        },
        d: {
            xx: 'adxx'
        },
        e: 'ae'
    }
}


const result = flatObj(entry);

console.log('entry result:', result);
