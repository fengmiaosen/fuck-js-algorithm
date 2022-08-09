function taskQueue(tasks = [], limit) {
    const res = [];
    let count = 0; //已经执行的任务数量(已执行不代表已返回)
    return new Promise(resolve => {
        for (let i = 0; i < limit; i++) {
            run();
        }
        // 任务总数len
        const len = tasks.length;
        // 执行任务
        function run() {
            // 这里不能用`count++;`代替哦，大家可以想下为什么？
            let current = count++;
            //临界条件
            if (current >= len) {
                res.length === len && resolve(res);
                return;
            }
            console.log("current", current);
            // 发送异步请求
            execute(tasks[current])
                .then(data => {
                    res.push(data);
                    // 如果还有任务没执行，就递归执行任务
                    if (current < len) {
                        run();
                    }
                })
                .catch(err => {
                    res.push(err);
                    // 如果还有任务没执行，就递归执行任务
                    if (current < len) {
                        run();
                    }
                });
        }
    });
}

function execute(url) {
    return new Promise(resolve => {
        // 模拟异步请求
        setTimeout(() => {
            console.log("任务：" + url + "完成", new Date());
            resolve({ url: url });
        }, 1000);
    });
}
// 测试
(async () => {
    const res = await taskQueue([1, 2, 3, 4, 5, 6, 7], 3);
    console.log("res", res);
})();
