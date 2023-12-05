
function flatten(obj) {

    let res = {}

    function dfs(obj, prefix = '') {
        if (typeof obj === 'object' && obj) {
            if (Array.isArray(obj)) {
                obj.forEach((item, idx) => {
                    dfs(item, `${prefix}[${idx}]`)
                })
            } else {
                for (let key in obj) {
                    let keyPath = prefix ? `${prefix}.${key}` : key
                    dfs(obj[key], keyPath)
                }
            }
        } else {
            res[prefix] = obj;
        }
    }

    dfs(obj)

    return res
}

const obj = {
    a: {
        b: 1,
        c: 2,
        d: { e: 5 }
    },
    b: [1, 3, { a: 2, b: 3 }],
    c: 3
}

console.log(flatten(obj))

