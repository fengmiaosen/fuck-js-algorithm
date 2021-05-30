/**
 * koa中间件合并方法，将中间件数组合并为一个中间件
 * https://segmentfault.com/a/1190000013981513
 * https://zhuanlan.zhihu.com/p/35040744
 * @param {array} middlewares 
 */
function compose(middlewares) {

    if (!Array.isArray(middlewares)) {
        throw new TypeError('Middleware stack must be an array!')
    }

    for (const fn of middlewares) {
        if (typeof fn !== 'function') {
            throw new TypeError('Middleware must be composed of functions!')
        }
    }

    /**
     * @param {Object} context
     * @param {Function} next
     * @return {Promise}
     * @api public
     */
    return function (context, next) {
        // last called middleware #
        let index = -1;

        return dispatch(0);

        function dispatch(i) {
            if (i <= index) {
                return Promise.reject(
                    new Error('next() called multiple times')
                )
            }

            index = i

            let fn = middlewares[i];

            if (i === middlewares.length) {
                fn = next
            }

            if (!fn) {
                return Promise.resolve()
            }

            try {
                return Promise.resolve(
                    fn(context, dispatch.bind(null, i + 1))
                );
            } catch (err) {
                return Promise.reject(err)
            }
        }
    }
}