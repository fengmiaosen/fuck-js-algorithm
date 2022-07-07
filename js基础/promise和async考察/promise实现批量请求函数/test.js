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

function multiRequest(urls = [], maxNum) {
    let count = 0
    let total = urls.length
    let results = new Array(total).fill(null)

    return new Promise((resolve, reject) => {
        function next() {
            let current = count
            count++

            if (current >= total) {
                if(!results.includes(null)){
                    resolve(results)
                }
                return
            }

            let url = urls[current]

            fetch(url).then(data => {
                results[current] = data
                if (current < total) {
                    next()
                }
            }).catch(e => {
                results[current] = e
                if (current < total) {
                    next()
                }
            })
        }

        //先请求maxNum个呗    
        while (count < maxNum) {
            next()
        }
    })
}

let url = `https://api.github.com/search/users?q=d`;
let arr = new Array(18).fill(url).map((item, idx) => `${item}&idx=${idx}`)

multiRequest(arr, 10).then((res) => {
    console.log('multiRequest:', res)
})
