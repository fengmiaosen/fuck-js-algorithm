
function promiseRetry(fn, times, delay) {

    return new Promise((resolve, reject) => {
        let timer = null;

        function request() {

            Promise.resolve(fn())
                .then(resolve)
                .catch(err => {
                    console.log(`request #${times} failed`);

                    if (times == 0) {
                        clearTimeout(timer);
                        reject(err);
                    } else {
                        times--;

                        timer = setTimeout(() => {
                            request();
                        }, delay)
                    }
                })
        }

        request();
    });
}


function fetchData() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            reject('server unavailable');
        }, 500);
    });
}

promiseRetry(fetchData,5,200);