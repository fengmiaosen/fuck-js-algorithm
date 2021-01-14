/**
 * koa compose函数，将多个中间件组合变为一个中间件
 * @param {array} middlewares 
 */
function compose(middlewares) {

    return function (context, next) {
        let index = -1

        function dispatch(idx) {
            // 避免陷入死循环
            if (idx <= index) {
                return Promise.reject(
                    new Error('next() called multiple times')
                )
            }

            index = idx

            const fn = index === middlewares.length ? next : middlewares[index]
            if (!fn) {
                return Promise.resolve()
            }

            try {
                return Promise.resolve(
                    fn(context, dispatch.bind(null, idx + 1))
                )
            } catch (e) {
                return Promise.reject(e)
            }
        }

        return dispatch(0)
    }
}