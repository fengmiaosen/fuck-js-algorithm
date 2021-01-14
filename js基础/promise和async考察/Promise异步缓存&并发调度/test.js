
class Scheduler {
    constructor({maxLimit}){
        this.maxLimit = maxLimit

        //  当前正在运行中的任务数量
        this.count = 0

        //  当前待运行的任务队列
        this.tasks = []
    }

    /**
     * 添加异步任务队列 promise对象类型
     * @param {Promise} promiseFn 
     */
    add(promiseFn){
        return new Promise((resolve, reject) => {
            promiseFn.resolve = resolve
            // 相当于挂载callback
            // promiseFn.callback = resolve

            if(this.count < this.maxLimit){
                this.run(promiseFn)
            } else {
                this.tasks.push(promiseFn)
            }
        })
    }

    run(promiseFn){
        this.count++

        // 执行任务，then中调用前面挂载的resolve 回调函数
        promiseFn().then(res => {
            promiseFn.resolve(res)
            this.count--

            // 每执行完一个任务，就去任务队列中查看是否还有待执行
            // 若存在任务，则从队列头部取出去执行
            if(this.tasks.length){
                this.run(this.tasks.shift())
            }
        })
    }
}


function sleep(time){
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time);
    });
}

const scheduler = new Scheduler({maxLimit: 3});

const addTask = (time, order) => {

    const fn = () => sleep(time);

    scheduler.add(fn).then(() => {
        console.log('order:', order);
    })
}

addTask(1000, 1) 
addTask(1000, 4) 
addTask(1000, 2) 
addTask(1000, 3)
addTask(1000, 5)
addTask(1000, 7)
addTask(1000, 6)
