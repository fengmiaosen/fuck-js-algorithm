const fetch = require('node-fetch');

// 用 promise 实现一个请求超时功能
// 关键词：promise.then 与 setTimeout 并行
// 抓住 promise 的状态只能由 pending -> fulfilled，或者 pending -> rejected，并且只能进行一次改变
function promiseWithTimeout(url, timeout = 300) {

    return new Promise((resolve, reject) => {
        fetch(url).then(data => data.text()).then(data => resolve(data)); // fetch 先得到结果就 resolve
        setTimeout(() => reject(Error('time is out!')), timeout); // 时间到了还没 fetch 到就 reject
    });
}

promiseWithTimeout('http://www.baidu.com')
    .then(data => console.log(data))
    .catch(err => console.error(err));