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

//   // 要求转换成如下对象
//   var output = {
//     'a.b.c.dd': 'abcdd',
//     'a.d.xx': 'adxx',
//     'a.e': 'ae'
//   }

function flatObj(obj, parentKeys = '', result = {}) {

    if (!obj || typeof obj !== 'object') {
        return result;
    }

    for (let key in obj) {
        const paths = parentKeys ? `${parentKeys}.${key}` : key;

        if (typeof obj[key] === 'object') {
            flatObj(obj[key], paths, result)
        } else {
            result[paths] = obj[key];
        }
    }

    return result;

}

console.log('flat obj:', flatObj(entry));