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
    let count = 0;        //已完成数

    return new Promise((resolve, reject) => {
        
        //先请求maxNum个呗    
        while (count < maxNum) {
            next()
        }
        
        function next() {
            let current = count++
            // 边界
            if (current >= sum) {
                !result.includes(false) && resolve(result)
                return
            }
            let url = urls[current];

            console.log("开始：" + current, new Date().toLocaleString());

            fetch(url).then((res) => {
                console.log("结束：" + current, new Date().toLocaleString());

                result[current] = res

                //还有未完成，递归；
                if (current < sum) {
                    next()
                }
            }).catch((err) => {
                console.log("结束：" + current, new Date().toLocaleString());
                
                result[current] = err
                if (current < sum) {
                    next()
                }
            })
        }

    })
}
let url2 = `https://api.github.com/search/users?q=d`;
let arr = new Array(100).fill(url2)
multiRequest(arr, 10).then((res) => {
    console.log(res)
})