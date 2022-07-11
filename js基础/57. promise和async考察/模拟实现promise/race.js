
// 方法返回一个 promise，一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。
function promiseRace(promises){

    return new Promise((resolve, reject) => {

        promises.forEach( p => {
            // 每个传入值使用Promise.resolve转为Promise对象，兼容非Promise对象
            Promise.resolve(p).then(resolve, reject);
        });
    })
}