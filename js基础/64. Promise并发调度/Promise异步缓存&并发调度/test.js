
class Scheduler {
    constructor(params) {
        this.maxLimit = params.maxLimit || 3;

        // 当前运行中的任务数
        this.currentCount = 0

        // 等待运行的任务队列
        this.pendingTasks = []
    }

    add(promiseFn) {
        return new Promise((resolve, reject) => {
            promiseFn.resolve = resolve

            if (this.currentCount < this.maxLimit) {
                this.run(promiseFn)
            } else {
                this.pendingTasks.push(promiseFn)
            }
        })
    }

    run(promiseFn) {
        this.currentCount++

        promiseFn().then(res => {
            this.currentCount--

            promiseFn.resolve(res)

            if (this.pendingTasks.length) {
                this.run(this.pendingTasks.shift())
            }
        })
    }
}


const scheduler = new Scheduler({ maxLimit: 3 });


function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time);
    });
}

const addTask = (time, order) => {

    const fn = () => sleep(time);

    scheduler.add(fn).then(() => {
        console.log('order:', order);
    })
}

addTask(600, 1)
addTask(400, 4)
addTask(200, 2)
addTask(2000, 3)
addTask(2500, 5)