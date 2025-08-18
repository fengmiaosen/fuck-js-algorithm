
function promiseAll(promises) {

    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError("argument must be an array"))
        }

        let len = promises.length;
        let resolveCount = 0;
        let result = [];

        for (let i = 0; i < len; i++) {
            // ((i) => {
            //     Promise.resolve(promises[i]).then(v => {
            //         resolveCount++;
            //         result[i] = v;

            //         if (resolveCount === len) {
            //             return resolve(result);
            //         }
            //     }).catch((err) => {
            //         return reject(err);
            //     })
            // })(i)

            Promise.resolve(promises[i]).then(v => {
                console.log('index i:', i);

                resolveCount++;
                result[i] = v;

                if (resolveCount === len) {
                    return resolve(result);
                }
            }).catch((err) => {
                return reject(err);
            })
        }
    });
}


function promiseAll2(promises) {
    if (!promises.length) {
        throw new Error('必须是数组格式！')
    }

    let len = promises.length
    let result = []
    let count = 0

    return new Promise((resolve, reject) => {
        promises.forEach((p, idx) => {
            Promise.resolve(p).then(res => {
                console.log('idx:', idx);
                count++;
                result[idx] = res  // Fixed: Use index to maintain order

                if (count === len) {
                    resolve(result)
                }
            }).catch(e => {
                reject(e)
            })
        })
    })
}

var p1 = Promise.resolve(1),
    p2 = Promise.resolve(2),
    p3 = Promise.resolve(3);

promiseAll([p1, p2, p3]).then(function (value) {
    console.log('p1:', value)
})

promiseAll2([p1, p2, p3]).then(function (value) {
    console.log('p2:', value)
})
