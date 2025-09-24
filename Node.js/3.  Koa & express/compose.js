/**
 * koa中间件合并方法，将中间件数组合并为一个中间件
 * 使用文档 https://github.com/demopark/koa-docs-Zh-CN/blob/master/guide.md#%E5%B0%86%E5%A4%9A%E4%B8%AA%E4%B8%AD%E9%97%B4%E4%BB%B6%E4%B8%8E-koa-compose-%E7%9B%B8%E7%BB%93%E5%90%88
 * https://github.com/koajs/compose/blob/master/index.js
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

/**
 * 
 * @param {function[]} middlewares 中间件数组
 * @returns 
 */
function composeSimple(middlewares) {
    return (ctx, next) => {
        return dispatch(0);

        function dispatch(i) {
            const fn = middlewares[i];

            if (i === middleware.length) fn = next

            // 当 fn 为空的时候，就会开始执行 next() 后面部分的代码
            if (!fn) return Promise.resolve()

            // 执行中间件，留意这两个参数，都是中间件的传参，第一个是上下文，第二个是 next 函数
            // 也就是说执行 next 的时候也就是调用 dispatch 函数的时候
            // bind 方法会创建一个新的函数，当这个新函数被调用时，它的 this 关键字会被设置为 bind() 的第一个参数，而其余参数会作为插入到传入绑定函数的参数前的参数。
            // 参考 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
            return fn(ctx, dispatch.bind(null, i + 1));
        }
    }
}

const middleware = []
let mw1 = async function (ctx, next) {
    console.log("next前，第一个中间件")
    await next()
    console.log("next后，第一个中间件")
}
let mw2 = async function (ctx, next) {
    console.log("next前，第二个中间件")
    await next()
    console.log("next后，第二个中间件")
}
let mw3 = async function (ctx, next) {
    console.log("第三个中间件，没有next了")
}

function use(mw) {
    middleware.push(mw);
}

use(mw1);
use(mw2);
use(mw3);

const fn = composeSimple(middleware);

fn();

