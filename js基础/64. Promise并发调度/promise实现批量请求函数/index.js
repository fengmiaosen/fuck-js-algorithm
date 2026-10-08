// 实现一个批量请求函数 multiRequest(urls, maxNum)

// 要求如下：

// 要求最大并发数 maxNum
// 每当有一个请求返回，就留下一个空位，可以增加新的请求
// 所有请求完成后，结果按照 urls 里面的顺序依次打出

// 这题如果maxNum 为无限大，其实就是在让你实现Promise.all
// 如果是有一个失败就返回 就是Promise.race

function multiRequest(urls = [], maxNum) {
    let result = new Array(urls.length).fill(false)
    let sum = urls.length; //总数
    let count = 0;        //已经执行的任务数量(已执行不代表已返回)

    return new Promise((resolve, reject) => {

        function next() {
            // 当前任务在队列中对应的索引号
            let current = count++
            // // 等同于
            // let current = count
            // count++

            // 边界
            if (current >= sum) {
                !result.includes(false) && resolve(result)
                return
            }

            // console.log("开始：" + current, new Date().toLocaleString());

            let url = urls[current];
            fetch(url).then((res) => {
                console.log("结束：" + current, new Date().toLocaleString());
                result[current] = res
            }).catch((err) => {
                console.log("结束：" + current, new Date().toLocaleString());
                console.log('catch err!', err)
                result[current] = err
            }).finally(() => {
                //检查是否所有请求都已完成
                const allCompleted = result.every(item => item !== false);
                if (allCompleted) {
                    resolve(result);
                } else if (count < sum) {
                    //还有未完成，递归；
                    next()
                }
            })
        }

        //先并发请求maxNum个呗    
        while (count < maxNum) {
            next()
        }

    })
}
let url2 = `https://api.github.com/search/users?q=d`;
let arr = new Array(15).fill(url2).map((item, idx) => `${item}&idx=${idx}`)

multiRequest(arr, 6).then((res) => {
    console.log(res)
})

function fetch(url) {
    return new Promise(resolve => {
        // console.log(`start request ${url}`);
        const timeout = parseInt(Math.random() * 5000);

        setTimeout(() => {
            // console.log(`end request ${url}`);
            resolve(url)
        }, timeout)
    })
};