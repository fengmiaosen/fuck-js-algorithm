
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
    z: new Map([
        [1, 'one'],
        [2, 'two'],
        [3, 'three'],
    ]),
    setxxx: new Set([1, 2, 3, { a: 1, b: 2, c: [1, 2, { aaa: 1 }] }])
};

function getObjType(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1)
}

function initTarget(obj) {
    if (Array.isArray(obj)) {
        return []
    } else if (typeof obj === 'object' && !obj) {
        // TODO 区分Map、Set
        const type = getObjType(obj)
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
        return {}
    } else {
        // TODO 区分基本类型、function
        return obj
    }
}

function setValue(obj, target, key) {
    const type = getObjType(obj)
    if (type === 'Map' || type === 'WeakMap') {
        target.set(key, obj.get(key))
    }
    else if (type === 'Set' || type === 'WeakSet') {
        target.add(obj.get(key))
    } else {
        target[key] = obj[key]
    }
}

function cloneDeepBFS(obj) {
    let queue = []
    let map = new WeakMap()
    let target = initTarget(obj)

    // 原始数据和目标数据均为非基本数据类型：Object、Array
    if (obj !== target) {
        queue.push([obj, target])
        map.set(obj, target)
    }

    while (queue.length) {
        let [obj, target] = queue.shift()

        const type = getObjType(obj)

        if (type === 'Array' || type === 'Object') {
            for (let key in obj) {
                if (map.has(obj[key])) {
                    // target[key] = map.get(obj[key])
                    setValue(map.get(obj[key]), target, key)
                } else {
                    target[key] = initTarget(obj[key])

                    if (obj[key] !== target[key]) {
                        queue.push([obj[key], target[key]])
                        map.set(obj[key], target[key])
                    }
                }
            }
        } else if (type === 'Map' || type === 'WeakMap') {
            for (let [key, value] of obj) {
                if (map.has(value)) {
                    setValue(map.get(value), target, key)
                } else {
                    target.set(key, initTarget(value))

                    if (target.get(key) !== value) {
                        queue.push([value, target.get(key)])
                        map.set(value, target.get(key))
                    }
                }
            }
        } else if (type === 'Set' || type === 'WeakSet') {
            for (let value of obj) {
                if (map.has(value)) {
                    setValue(map.get(value), target, key)
                } else {
                    const targetValue = initTarget(value)
                    target.add(targetValue)
                    if (targetValue !== value) {
                        queue.push([value, targetValue])
                        map.set(value, targetValue)
                    }
                }
            }
        }
        // TODO Function、Regex、Date等
    }

    return target

}

console.log('clonedeep obj:', cloneDeepBFS(obj));
