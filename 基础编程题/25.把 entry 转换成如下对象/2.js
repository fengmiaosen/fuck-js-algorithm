var entry = {
    a: {
        b: {
            c: {
                dd: 'abcdd'
            },
            c2: {
                d2: {
                    e2: '22222'
                }
            }
        },
        d: {
            xx: 'adxx'
        },
        e: 'ae'
    }
}

//   // 要求转换成如下对象
//   var output = {
//     'a.b.c.dd': 'abcdd',
//     'a.d.xx': 'adxx',
//     'a.e': 'ae'
//   }

function flatObj(obj, map = {}, paths = '') {
    console.log('obj:', obj, 'paths:', paths);

    if (!obj) {
        return map;
    }

    for (let key in obj) {
        const pathKey = paths ? `${paths}.${key}` : key;

        if (typeof obj[key] === 'object') {
            flatObj(obj[key], map, pathKey);
        } else {
            map[pathKey] = obj[key];
        }
    }

    return map;
}

console.log('flat obj:', flatObj(entry));