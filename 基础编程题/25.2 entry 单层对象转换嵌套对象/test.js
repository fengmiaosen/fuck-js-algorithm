const entry = {
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


function convert(obj) {
    let res = {}

    for (let key in obj) {
        if (key.includes('.')) {
            const ks = key.split('.')
            let curRes = res;

            ks.forEach((k, idx) => {
                if (!curRes[k]) {
                    if (idx === ks.length - 1) {
                        curRes[k] = obj[key]
                    } else {
                        curRes[k] = {}
                    }
                }
                curRes = curRes[k]
            })
        } else {
            res[key] = obj[key]
        }
    }

    return res;
}

function convert2(obj) {
    let res = {}

    for (let key in obj) {
        if (key.includes('.')) {
            const ks = key.split('.')

            ks.reduce((acc, cur, idx) => {
                if (idx === ks.length - 1) {
                    acc[cur] = obj[key]
                } else {
                    acc[cur] = acc[cur] || {}
                }
                return acc[cur];
            }, res)
        } else {
            res[key] = obj[key]
        }
    }

    return res;
}

console.log(JSON.stringify(convert(entry)))

console.log(JSON.stringify(convert2(entry)))
