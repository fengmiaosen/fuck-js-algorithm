
function promiseAll(promises) {

    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError("argument must be an array"))
        }

        let len = promises.length;
        let resolveCount = 0;
        let result = [];

        for (let i = 0; i < len; i++) {
            ((i) => {
                Promise.resolve(promises[i]).then(v => {
                    resolveCount++;
                    result[i] = v;

                    if (resolveCount === len) {
                        return resolve(result);
                    }
                }).catch((err) => {
                    return reject(err);
                })
            })(i)
        }
    });
}

var p1 = Promise.resolve(1),
    p2 = Promise.resolve(2),
    p3 = Promise.resolve(3);
    
promiseAll([p1, p2, p3]).then(function (value) {
    console.log(value)
})