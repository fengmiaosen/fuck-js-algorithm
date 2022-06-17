// 深度优先遍历 DFS

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
        //根据面试题目需要，此处可以对key做一些处理
        const newKey = key;

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

console.log('clone obj:', JSON.stringify(cloneObj(obj)));