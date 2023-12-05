
let entry = {
    'a.b.c.dd': 'abcdd',
    'a.d.xx': 'adxx',
    'a.e': 'ae',
    'f': 'fff'
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

function convertObj(entry) {
    let res = {}

    for (let key in entry) {
        if (key.includes('.')) {
            let keyList = key.split('.')
            keyList.reduce((acc, cur, idx) => {
                if (idx === keyList.length - 1) {
                    acc[cur] = entry[key]
                } else {
                    acc[cur] = acc[cur] || {}
                }

                return acc[cur]
            }, res)
        } else {
            res[key] = entry[key]
        }
    }

    return res
}

console.dir(convertObj(entry), { depth: null })