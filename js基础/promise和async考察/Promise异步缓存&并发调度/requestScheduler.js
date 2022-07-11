// 实现一个带并发限制的异步调度器，保证同时最多运行N个任务
// 参考 
// https://juejin.im/post/5d38384df265da1b88121f24
// https://github.com/zhufengnodejs/zhufeng_interview/issues/1
// https://blog.csdn.net/brokenkay/article/details/104852296

class Scheduler {

    constructor(params) {
        const { maxLimit } = params;

        //支持的最大任务并发数
        this.maxLimit = maxLimit || 3;

        //当前运行中的任务数
        this.concurrent = 0;

        // 待运行的任务队列
        this.tasks = [];
    }

    /**
     * promiseFn 是一个异步函数，return Promise
     * @param {function} promiseFn 
     */
    add(promiseFn) {
        return new Promise((resolve, reject) => {
            // 将resolve挂载到当前任务的promise上面，便于执行任务后调用
            promiseFn.resolve = resolve;

            // 判断当前运行中的任务数是否超过最大并发数
            // 若没超过就逐个调用执行，即在前一个promise的then回调中递归调用执行下一个promise
            // 若超过则将其push到待运行任务队列中
            if (this.concurrent < this.maxLimit) {
                this.runTask(promiseFn);
            } else {
                this.tasks.push(promiseFn);
            }
        })
    }

    runTask(promiseFn) {
        this.concurrent++;

        promiseFn().then(() => {
            // 异步任务函数，变为success 状态
            promiseFn.resolve();

            this.concurrent--;

            // 判断待执行任务队列中是否还有任务，如有则从队列头部弹出去执行
            if(this.tasks.length > 0){
                this.runTask(this.tasks.shift());
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

addTask(600, 1) 
addTask(400, 4) 
addTask(200, 2) 
addTask(2000, 3)
