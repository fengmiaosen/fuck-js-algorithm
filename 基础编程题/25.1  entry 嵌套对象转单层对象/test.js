
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
    },
    fg: 'a12'
}

function convertObj(obj) {

    let res = {}

    function dfs(value, prefix = '') {
        if (typeof value === 'object') {
            if (value) {
                for (let key in value) {
                    const keyPath = prefix ? `${prefix}.${key}` : key
                    dfs(value[key], keyPath)
                }
            } else {
                res[prefix] = value
            }
        } else {
            res[prefix] = value
        }
    }

    dfs(obj)

    return res
}

console.log(convertObj(entry))