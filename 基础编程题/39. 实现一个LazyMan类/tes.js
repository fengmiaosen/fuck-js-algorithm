
class LazyManClass {

    constructor(name) {
        this.name = name
        // 任务队列，先进先出（FIFO）
        this.queue = []
        console.log(`Hi I am ${name}`)

        setTimeout(() => {
            this.next();
        }, 0)
    }

    next() {
        const task = this.queue.shift();
        task?.();

        return this
    }

    eat(type) {
        const fn = () => {
            console.log(`I am eating `, type);
            this.next();
        }

        this.queue.push(fn);
        return this

    }

    sleep(time) {
        const fn = () => {
            setTimeout(() => {
                console.log(`等待了${time}秒`)
                this.next();
            }, time * 1000);
        }
        this.queue.push(fn);
        return this

    }

    sleepFirst(time) {
        const fn = () => {
            setTimeout(() => {
                console.log(`等待了${time}秒`)
                this.next();
            }, time * 1000);
        }
        this.queue.unshift(fn);
        return this

    }

}


function LazyMan(name) {
    return new LazyManClass(name)
}


LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5).sleep(10).eat('junk food');
