
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

function multiRequest(arr, maxLength) {
    let sum = arr.length
    let res = new Array(sum).fill(false)
    let count = 0

    return new Promise((resolve, reject) => {
        function run() {
            let current = count++

            if (current >= sum && !res.includes(false)) {
                resolve(res.filter(t => !!t))
                return
            }

            let url = arr[current];
            fetch(url).then(data => {
                res[current] = data
            }).catch(err => {
                res[current] = err
            }).finally(() => {
                console.log("结束：" + current, new Date().toLocaleString());
                if (current < sum) {
                    run()
                }
            })

        }

        while (count < maxLength) {
            run()
        }
    })
}

let url2 = `https://api.github.com/search/users?q=d`;
let arr = new Array(15).fill(url2).map((item, idx) => `${item}&idx=${idx}`)

multiRequest(arr, 6).then((res) => {
    console.log('multiRequest:', res)
})

