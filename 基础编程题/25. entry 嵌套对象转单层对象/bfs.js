// bfs 广度优先遍历
// 层次遍历

function flatObj(entry) {
    const queue = Object.entries(entry)
    const res = {}
    console.log('queue:', queue)

    while (queue.length) {
        const [key, obj] = queue.shift()

        if (typeof obj === 'object') {
            for (const [k, v] of Object.entries(obj)) {
                if (typeof v !== 'object') {
                    res[`${key}.${k}`] = v
                } else {
                    queue.push([`${key}.${k}`, v])
                }
            }
        } else {
            res[key] = obj
        }
    }
    return res
}

var entry = {
    a: {
        b: {
            c: {
                dd: '1234566'
            }
        },
        d: {
            xx: 'adxx'
        },
        e: 'ae'
    },
    aa: 'a12'
}


const result = flatObj(entry);

console.log('entry result:', result);
