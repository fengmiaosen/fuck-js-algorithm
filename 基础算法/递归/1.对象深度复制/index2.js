
function cloneDeep(obj, map = new WeakMap()) {
    if (!(typeof obj === 'object') || !obj) {
        return obj
    }

    // 避免循环引用
    if (map.has(obj)) {
        return map.get(obj)
    }

    let target = Array.isArray(obj) ? [] : {}
    map.set(obj, target)

    for (let key in obj) {
        if (obj.hasOwnproperty(key)) {
            if (typeof obj[key] === 'object') {
                target = cloneDeep(obj[key], map)
            } else {
                target[key] = obj[key]
            }
        }
    }

    return target
}