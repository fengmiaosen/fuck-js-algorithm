// TODO 增加对 Map Set Symbol类型的支持
function initTarget(obj) {
    if (Array.isArray(obj)) {
        return [];
    } else if (typeof obj === 'object' && !obj) {
        return {};
    }
    return obj;
}

function cloneDeep(obj) {
    let queue = [];
    let map = new WeakMap();

    let target = initTarget(obj);
    
    // 原始值为对象、数组等引用类型
    if (target !== obj) {
        queue.push([obj, target]);
        map.set(obj, target);
    }

    while (queue.length) {
        let [obj, target] = queue.shift();

        //将当前对象的所有字段加入队列中
        for (let key in obj) {
            //防止循环引用
            if (map.has(obj[key])) {
                target[key] = map.get(obj[key]);
                continue;
            }

            target[key] = initTarget(obj[key]);

            // 原始值为对象、数组等引用类型
            if (target[key] !== obj[key]) {
                map.set(obj[key], target[key]);
                queue.push([obj[key], target[key]]);
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

console.log('clone obj:', JSON.stringify(cloneDeep(obj)));