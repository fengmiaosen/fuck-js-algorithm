
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

//   // 要求转换成如下对象
//   var output = {
//     'a.b.c.dd': 'abcdd',
//     'a.d.xx': 'adxx',
//     'a.e': 'ae'
//   }

// 方法1 递归
function fn1(obj) {

    function flatObj(obj, parentKey = '', result = {}) {

        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                const curKey = parentKey ? `${parentKey}.${key}` : key
                if (typeof obj[key] === 'object') {
                    flatObj(obj[key], curKey, result)
                } else {
                    result[curKey] = obj[key]
                }
            }

        }
        return result
    }

    return flatObj(obj)
}


// 方法2 bfs
function fn2(obj) {

}

console.log(fn1(entry))
console.log(fn2(entry))