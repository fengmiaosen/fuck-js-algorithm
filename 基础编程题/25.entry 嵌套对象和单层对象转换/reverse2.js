var entry = {
    'a.b.c.dd': 'abcdd',
    'a.d.xx': 'adxx',
    'a.e': 'ae',
    'fv': 'fvfv'
}

// // 要求转换成如下对象
// var output = {
//   a: {
//     b: {
//       c: {
//         dd: 'abcdd'
//       }
//     },
//     d: {
//       xx: 'adxx'
//     },
//     e: 'ae'
//   }
// }

function convert(entry) {
    let result = {}

    for (let key in entry) {
        const keys = key.split('.')
        if (keys.length > 1) {
            // 方法一
            let cur = result
            keys.forEach((k, idx) => {
                if (idx === keys.length - 1) {
                    cur[k] = entry[key]
                } else {
                    cur[k] = cur[k] || {}
                    cur = cur[k]
                }
            })
        } else {
            result[key] = entry[key]
        }
    }

    return result
}

// 方法二： reduce
function convert2(entry) {
    let result = {}

    for (let key in entry) {
        const keys = key.split('.')
        if (keys.length > 1) {
            keys.reduce((curObj, curKey, idx) => {
                if (idx === keys.length - 1) {
                    curObj[curKey] = entry[key]
                } else {
                    curObj[curKey] = curObj[curKey] || {}
                    return curObj[curKey]
                }
            }, result)
        } else {
            result[key] = entry[key]
        }
    }

    return result
}

console.dir(convert(entry), { depth: null })
console.dir(convert2(entry), { depth: null })