// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally

// 方法一
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

//方法2 简洁版
// https://github.com/matthew-andrews/Promise.prototype.finally/blob/master/finally.js
// 为什么需要Promise.resolve(callback()).then(() => value)
// 因为callback如果是个异步操作，返回promise呢.希望等callback执行完再接着执行

Promise.prototype.finally = function (callback) {
    let P = this.constructor;

    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => {
            throw reason
        })
    );
};

//方法3 超级简洁版
Promise.prototype.finally = function (callback) {
    return this.then(
        res => {
            callback();
            return res;
        },
        err => {
            callback();
            throw err;
        }
    )
};

/*********************** 测试 ***********************/
const p = new Promise((resolve, reject) => {
    console.info('starting...');

    setTimeout(() => {
        Math.random() > 0.5 ? resolve('success') : reject('fail');
    }, 1000);
});

// 正常顺序测试
console.log('正常顺序测试=>');

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
console.log('finally 前置测试=>');

p.finally(() => {
        console.info('finally: completed')
    })
    .then((data) => {
        console.log(`%c resolve: ${data}`, 'color: green')
    })
    .catch((err) => {
        console.log(`%c catch: ${err}`, 'color: red')
    });