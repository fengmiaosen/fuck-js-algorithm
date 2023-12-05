
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


function cloneObj(obj, map = new WeakMap()) {
    if (!obj || typeof obj !== 'object') {
        return obj
    }

    let target = Array.isArray(obj) ? [] : {}

    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            if (!obj[key]) {
                target[key] = obj[key]
            } else {
                target[key] = cloneObj(obj[key], map)
            }
        } else {
            target[key] = obj[key]
        }
    }

    return target
}


console.log(JSON.stringify(cloneObj(obj)))