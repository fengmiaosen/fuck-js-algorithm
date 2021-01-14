
function promiseFn(fn) {

    return (...args) => {

        return new Promise((resolve, reject) => {
            fn(...args, (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }
}

