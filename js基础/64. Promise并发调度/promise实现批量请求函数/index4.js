Promise.limitAll = function (promises, limit) {
    const total = promises.length;

    return new Promise((resolve) => {
        let resolvedCount = 0;
        let count = 0;
        let res = [];

        function next(p, index) {
            p().then((r) => {
                res[index] = r;
                resolvedCount++;

                if (promises.length) {
                    const p = promises.shift();
                    next(p, count);
                    count++;
                } else if (resolvedCount === total) {
                    resolve(res);
                }
            });
        }

        while (count < limit && promises.length) {
            const p = promises.shift();
            next(p, count);
            count++;
        }
    });
};

const promiseFactory = (res, timeout) => {
    return () =>
        new Promise((resolve) => {
            console.count("get in pool");
            setTimeout(() => {
                resolve(res);
            }, timeout);
        });
};

console.time("start");

Promise.limitAll(
    [
        promiseFactory(1, 1000),
        promiseFactory(2, 2000),
        promiseFactory(3, 2000),
        promiseFactory(4, 1000),
        promiseFactory(5, 1000),
        promiseFactory(6, 500),
        promiseFactory(7, 500)
    ],
    3
).then((res) => {
    console.log(res);
    console.timeEnd("start");
});
