
Promise.prototype.finally2 = function (callback) {
    const P = this.constructor

    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback).then(() => reason)
    )
}