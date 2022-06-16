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

function cloneDeep(obj) {

    let queue = []
    let map = new WeakMap();

    let target = Array.isArray(obj) ? [] : {}
    map.set(obj, target)
    queue.push([obj, target])

    while (queue.length) {
        const [obj, target] = queue.shift();

        for (let key in obj) {
            if (map.has(obj[key])) {
                target[key] = map.get(obj[key])
                continue
            }

            if (typeof obj[key] === 'object') {
                if (!obj[key]) {
                    target[key] = obj[key]
                } else {
                    target[key] = Array.isArray(obj[key]) ? [] : {}
                    queue.push([obj[key], target[key]])
                }
            } else {
                target[key] = obj[key]
            }
        }
    }
    return target
}

console.log('clone obj:', JSON.stringify(cloneDeep(obj)))