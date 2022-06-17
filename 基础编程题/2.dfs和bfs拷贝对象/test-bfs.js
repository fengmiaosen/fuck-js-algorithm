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
    ],
    map_aaa: new Map([
        [1, 'one'],
        [2, 'two'],
        [3, 'three'],
    ]),
    set_bbb: new Set([1, 2, 3, { a: 1, b: 2, c: [1, 2, { aaa: 1 }] }])
};

function getType(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1)
}

function initTarget(obj) {
    const type = getType(obj)

    if (Array.isArray(obj)) {
        return []
    } else if (typeof obj === 'object' && !obj) {
        if (type === 'Map') {
            return new Map()
        }
        if (type === 'WeakMap') {
            return new WeakMap()
        }
        if (type === 'Set') {
            return new Set()
        }
        if (type === 'WeakSet') {
            return new WeakSet()
        }
    } else {
        // null
        return obj;
    }
}

function setTarget(obj, target, key) {
    const type = getType(obj)

    if (Array.isArray(obj)) {
        target[key] = obj[key]
    } else if (typeof obj === 'object' && !obj) {
        if (type === 'Map' || type === 'WeakMap') {
            target.set(key, obj.get(key))
        } else if (type === 'Set' || type === 'WeakSet') {
            target.add(obj[key])
        } else {
            target[key] = obj[key]
        }
    }
}


function cloneDeep(obj) {

    let queue = []
    let map = new WeakMap();

    // TODO
    let target = initTarget(obj)
    map.set(obj, target)
    queue.push([obj, target])

    while (queue.length) {
        const [obj, target] = queue.shift();

        //  类型不同，采用不同的遍历实现
        for (let key in obj) {
            if (map.has(obj[key])) {
                target[key] = map.get(obj[key])
                continue
            }

            if (typeof obj[key] === 'object') {
                if (!obj[key]) {
                    target[key] = obj[key]
                } else {
                    // TODO
                    target[key] = initTarget(obj[key])
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