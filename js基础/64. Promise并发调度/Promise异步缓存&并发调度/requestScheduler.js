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
        this.pendingTasks = [];
    }

    /**
     * promiseFn 是一个异步函数，return Promise
     * @param {function} promiseFn 
     */
    add(promiseFn) {
        return new Promise((resolve, reject) => {
            // 将resolve/reject挂载到当前任务函数上，便于任务完成后回传结果
            promiseFn.resolve = resolve;
            promiseFn.reject = reject;

            // 判断当前运行中的任务数是否超过最大并发数
            // 若没超过就逐个调用执行，即在前一个promise的then回调中递归调用执行下一个promise
            // 若超过则将其push到待运行任务队列中
            if (this.concurrent < this.maxLimit) {
                this.runTask(promiseFn);
            } else {
                this.pendingTasks.push(promiseFn);
            }
        })
    }

    runTask(promiseFn) {
        this.concurrent++;

        Promise.resolve()
            .then(() => promiseFn())
            .then((value) => {
                // 异步任务函数，变为 success 状态
                promiseFn.resolve && promiseFn.resolve(value);
            })
            .catch((error) => {
                // 失败时也需要推进队列，避免饿死
                if (promiseFn.reject) {
                    promiseFn.reject(error);
                } else if (promiseFn.resolve) {
                    // 如果调用方未监听 reject，保持兼容，仍然 resolve 以不中断后续任务
                    promiseFn.resolve();
                }
            })
            .finally(() => {
                this.concurrent--;

                // 判断待执行任务队列中是否还有任务，如有则从队列头部弹出去执行
                if (this.pendingTasks.length > 0) {
                    let headTask = this.pendingTasks.shift();
                    this.runTask(headTask);
                }
            })
    }
}

function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time);
    });
}

const scheduler = new Scheduler({ maxLimit: 3 });

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
