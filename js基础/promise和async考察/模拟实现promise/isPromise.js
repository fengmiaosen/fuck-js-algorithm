function isPromise(val){
    return val && Object.prototype.toString.call(val)
}

console.log(isPromise(Promise.resolve(1)))