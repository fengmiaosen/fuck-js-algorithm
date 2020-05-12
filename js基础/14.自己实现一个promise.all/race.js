
function promiseRace(promises){

    return new Promise((resolve, reject) => {

        promises.forEach( p => {
            Promise.resolve(p).then(resolve, reject);
        });
    })
}