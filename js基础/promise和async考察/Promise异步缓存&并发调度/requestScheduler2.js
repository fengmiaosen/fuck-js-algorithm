// 在开发中，我们可能会遇到一些对异步请求数做并发量限制的场景，比如说微信小程序的request并发最多为5个，又或者我们需要做一些批量处理的工作，可是我们又不想同时对服务器发出太多请求（可能会对服务器造成比较大的压力）。这个时候我们就可以对请求并发数进行限制，并且使用排队机制让请求有序的发送出去。

//参考  
// https://zhuanlan.zhihu.com/p/44465829
// https://blog.csdn.net/brokenkay/article/details/104852296
// 关键词
// async/await
// try -> catch -> finally

class Scheduler {

    constructor(params) {
        const { maxLimit } = params;

        this.maxLimit = maxLimit || 5;

        // 当前执行中的并发任务数
        this.concurrentCount = 0;

        // 待执行的请求任务队列
        this.tasks = [];
    }

    /**
     * 
     * @param {function} promiseFn 
     */
    async add(promiseFn) {

        if (this.concurrentCount >= this.maxLimit) {
            await this.blockTask();
        }

        try {
            this.concurrentCount++;

            const res = await promiseFn();
            
            // 注意：先执行return后面的表达式
            //  但是会在finally中语句块执行完之后才会执行真正的 return操作
            return Promise.resolve(res);

        } catch (err) {
            return Promise.reject(err);

        } finally {
            // 1. finally 语法支持任何的结束 try..catch 执行的方式，包括明确的 return
            // 2. 在代码执行的控制权转移到外部代码之前， finally 代码块会被执行。即 finally中的代码最终也会在try或catch block显式返回 return 时执行。

            console.log('当前并发数:', this.concurrentCount);

            this.concurrentCount--;

            // 执行并发任务队列中下一个任务
            if (this.tasks.length > 0) {
                this.next();
            }
        }
    }

    blockTask() {
        return new Promise((resolve, reject) => {
            this.tasks.push(resolve);
        });
    }

    next() {
        const taskResolve = this.tasks.shift();
        taskResolve();
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

addTask(1000, 1)
addTask(1000, 2)
addTask(1000, 3)
addTask(1000, 4)
addTask(1000, 5) 