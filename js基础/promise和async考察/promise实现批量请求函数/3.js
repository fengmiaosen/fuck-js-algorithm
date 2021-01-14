

function fetch(url) {
    return new Promise(resolve => {
        // console.log(`start request ${url}`);
        const timeout = parseInt(Math.random() * 3000);

        setTimeout(() => {
            // console.log(`end request ${url}`);
            resolve(url)
        }, timeout)
    })
}

/**
 * 相当于模拟一个并发请求的 promise.all
 * @param {array} urls 
 * @param {number} maxNum 
 */
function multiRequest(urls, maxNum) {
    let total = urls.length
    let result = new Array(total).fill(false)
    let count = 0

    return new Promise((resolve, reject) => {

        function next() {
            // 索引号用来保证请求和响应的顺序一一对应
            let idx = count
            count++

            if (idx >= total) {
                if (result.filter(item => item).length === total) {
                    resolve(result)
                }
                return
            }

            console.log('fetch start:', idx)
            fetch(urls[idx]).then(res => {
                console.log('fetch end res:', idx)
                result[idx] = res
                if (idx < total) {
                    next()
                }
            }).catch(err => {
                console.log('fetch end err:', idx)
                result[idx] = err
                if (idx < total) {
                    next()
                }
            })

        }

        while (count < maxNum) {
            next()
        }

    })
}

let url2 = `https://api.github.com/search/users?q=d`;
let arr = new Array(23).fill(url2).map((item, idx) => `${item}&idx=${idx}`)

multiRequest(arr, 5).then((res) => {
    console.log(res)
})