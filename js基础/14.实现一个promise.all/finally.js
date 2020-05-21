window.Promise && !('finally' in Promise) && ! function () {
    Promise.prototype.finally = function (cb) {
        cb = typeof cb === 'function' ? cb : function () {};

        var Fn = this.constructor; // 获取当前实例构造函数的引用

        // 接受状态：返回数据
        var onFulfilled = function (data) {
            return Fn.resolve(cb()).then(function () {
                return data
            })
        };

        // 拒绝状态：抛出错误
        var onRejected = function (err) {
            return Fn.resolve(cb()).then(function () {
                throw err
            })
        };

        return this.then(onFulfilled, onRejected);
    }
}();

//方法2 简洁版
Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => {
            throw reason
        })
    );
};

/*********************** 测试 ***********************/
const p = new Promise((resolve, reject) => {
    console.info('starting...');

    setTimeout(() => {
        Math.random() > 0.5 ? resolve('success') : reject('fail');
    }, 1000);
});

// 正常顺序测试
p.then((data) => {
        console.log(`%c resolve: ${data}`, 'color: green')
    })
    .catch((err) => {
        console.log(`%c catch: ${err}`, 'color: red')
    })
    .finally(() => {
        console.info('finally: completed')
    });

// finally 前置测试  
p.finally(() => {
        console.info('finally: completed')
    })
    .then((data) => {
        console.log(`%c resolve: ${data}`, 'color: green')
    })
    .catch((err) => {
        console.log(`%c catch: ${err}`, 'color: red')
    });