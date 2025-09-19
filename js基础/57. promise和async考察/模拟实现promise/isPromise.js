function isPromise(val){
    return val && Object.prototype.toString.call(val) === '[object Promise]'
}

console.log(isPromise(Promise.resolve(1))) // true
console.log(isPromise(new Promise((resolve, reject) => {
    resolve(1)
}))) // true
console.log(isPromise({})) // false
console.log(isPromise(null)) // false