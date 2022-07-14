
function promisify(func) {

    return (...params) => {
        return new Promise((resolve, reject) => {
            func(...params, (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }
}