
class LazyManClass {
    constructor(name) {
        this.name = name;
        this.queue = [];

        console.log(`Hi I am ${name}`)

        //延迟执行任务队列中的函数任务
        setTimeout(() => {
            this.next()
        }, 0)
    }

    sleep(time) {
        const fn = () => {
            setTimeout(() => {
                console.log(`等待了${time}秒`)
                this.next();
            }, time * 1000);
        }

        this.queue.push(fn);

        return this;
    }

    sleepFirst(time) {
        const fn = () => {
            setTimeout(() => {
                console.log(`等待了${time}秒`)
                this.next();
            }, time * 1000);
        };

        this.queue.unshift(fn);

        return this;
    }

    next() {
        const task = this.queue.shift();
        task && task();

        return this;
    }

    eat(food) {
        const fn = () => {
            console.log(`I am eating ${food}`)
            this.next();
        };

        this.queue.push(fn);

        return this;
    }
}

function LazyMan(name) {
    return new LazyManClass(name);
}

// demo
LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(1).sleep(2).eat('junk food');

// LazyMan('Tony').eat('lunch')