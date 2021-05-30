
// 手写实现深拷贝
function checkedType(target) {
    return Object.prototype.toString.call(target).slice(8, -1)
}


function cloneObj(obj, map = new WeakMap()) {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }

    //对于循环引用，直接返回map中已存储的
    if (map.has(obj)) {
        return map.get(obj);
    }

    // 此次要拷贝的对象
    let target = Array.isArray(obj) ? [] : {};

    //记录已拷贝过的对象
    map.set(obj, target);

    for (let key in obj) {
        const newKey = formatKey(key);

        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                if (!obj[key]) {
                    target[newKey] = obj[key];
                } else {
                    target[newKey] = cloneObj(obj[key], map);
                }
            } else {
                target[newKey] = obj[key];
            }
        }
    }

    return target;
}


/**
 * 处理对象字段中的下划线，转换为驼峰式命名格式
 * 例如 a_b_c -> aBC
 * @param {string} key 
 */
// function formatKey(key) {
//     if (key.length < 2 || !key.includes('_')) {
//         return key;
//     }

//     const parts = key.split('_');
//     const newKey = [parts[0]];

//     for (let i = 1; i < parts.length; i++) {
//         parts[i] = parts[i][0].toUpperCase()
//         newKey.push(parts[i])
//     }

//     return newKey.join('');
// }

/**
 * 方法二
 * 利用正则表达式替换转化为驼峰命名
 * @param {string} key 
 */
function formatKey(key) {
    if (key.length < 2 || !key.includes('_')) {
        return key;
    }

    return key.replace(/[-_](\w){1}/g, (x, f) => {
        return f.toUpperCase();
    })
}

let obj = {
    a: {
        a_bfff_x: [
            1,
            {
                c: 2
            }
        ]
    },
    x_booo: 1,
    y: [
        {
            a_yppp: 22,
            b: null,
            c: {
                d: [12, 34, 67]
            }
        }
    ]
};

console.log('souce obj:', JSON.stringify(obj));

// let copyObj = cloneDeep(obj);

let copyObj = cloneObj(obj);

// copyObj.a.a_b_x[0] = 111111;
// copyObj.y[0].a = 333333;

// console.log('copy obj:', JSON.stringify(obj));

console.log('copy obj:', JSON.stringify(copyObj));
