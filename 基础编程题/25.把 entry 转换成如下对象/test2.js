var entry = {
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

    let result = {};

    for (let key in obj) {
        if (key.includes('.')) {

            const keys = key.split('.');

            // 临时对象先初始化为指向结果对象
            let curObj = result;

            // 相当于自顶向下逐层赋值
            // 将上层的对象赋值到临时对象，给下一层使用
            // {a:{b:{c:{d:'333'}}}}
            for (let i = 0; i < keys.length; i++) {
                const item = keys[i];

                if (!curObj[item]) {
                    if (i === keys.length - 1) {
                        curObj[item] = obj[key];
                    } else {
                        curObj[item] = {};
                    }
                }

                curObj = curObj[item];
            }
        } else {
            result[key] = obj[key];
        }
    }

    return result;
}

console.log('obj output:', JSON.stringify(convert(entry)));