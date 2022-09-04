function isObject(val) {
    return typeof val === "object" && val !== null;
}

function flatten(obj) {
    if (!isObject(obj)) {
        return;
    }
    let res = {};
    
    const dfs = (cur, prefix) => {
        if (isObject(cur)) {
            if (Array.isArray(cur)) {
                cur.forEach((item, index) => {
                    dfs(item, `${prefix}[${index}]`);
                });
            } else {
                for (let k in cur) {
                    dfs(cur[k], `${prefix}${prefix ? "." : ""}${k}`);
                }
            }
        } else {
            res[prefix] = cur;
        }
    };
    dfs(obj, "");

    return res;
}

const obj = {
    a: {
        b: 1,
        c: 2,
        d: { e: 5 }
    },
    b: [1, 3, { a: 2, b: 3 }],
    c: 3
}

console.log(flatten(obj))