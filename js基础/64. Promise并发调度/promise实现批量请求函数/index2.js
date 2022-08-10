

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

function asyncPool(fn, arr, limit = 10) {
    let args = [...arr]   //不修改原参数数组
    let results = []      //存放最终结果
    let runningCount = 0  //正在运行的数量
    let resultIndex = 0   //结果的下标，用于控制结果的顺序
    let resultCount = 0   //结果的数量

    return new Promise((resolve) => {
        function run() {
            while (runningCount < limit && args.length > 0) {
                runningCount++

                ((i) => {        //闭包用于保存结果下标，便于在resolve时把结果放到合适的位置
                    let v = args.shift()
                    console.log('正在运行' + runningCount)
                    fn(v).then(val => {
                        results[i] = val
                    }, () => {
                        throw new Error(`An error occurred: ${v}`)
                    }).finally(() => {
                        runningCount--
                        resultCount++
                        if (resultCount === arr.length) {  //这里之所以用resultCount做判断，而不用results的长度和args的长度，是因为这两个都不准确
                            resolve(results)
                        } else {
                            run()
                        }
                    })
                })(resultIndex++)
            }
        }
        run()
    })
}


//测试
function getWeather(city) {
    console.log(`开始获取${city}的天气`)
    return fetch(`https://api2.jirengu.com/getWeather.php?city=${city}`).then(res => res.json())
}

let citys = ['北京', '上海', '杭州', '成都', '武汉', '天津', '深圳', '广州', '合肥', '郑州']
asyncPool(getWeather, citys, 2).then(results => console.log(results))