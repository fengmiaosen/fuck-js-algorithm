//util.promisify 
// https://nodejs.org/api/util.html#utilpromisifyoriginal

// const stat = util.promisify(fs.stat);

// stat('.').then((stats) => {
//   // Do something with `stats`
// }).catch((error) => {
//   // Handle the error.
// });

function promisify(func) {

    return (...args) => {

        return new Promise((resolve, reject) => {

            func(...args, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        });
    }
}
