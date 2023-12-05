
class LazyManClass {
    constructor(name) {
        this.name = name
        this.queue = []

        console.log(`I am ${name}`)

        setTimeout(() => {
            this.next();
        }, 0)
    }

    next() {
        let task = this.queue.shift()
        task?.();

        return this;
    }

    eat(food) {
        let fn = () => {
            console.log(food)
            this.next();
        }

        this.queue.push(fn);

        return this;
    }

    sleepFirst(timeout) {
        let fn = () => {
            setTimeout(() => {
                this.next();
            }, timeout * 1000);
        }

        this.queue.unshift(fn)

        return this;
    }

    sleep(timeout) {
        let fn = () => {
            setTimeout(() => {
                this.next();
            }, timeout * 1000);
        }

        this.queue.push(fn);
        return this;
    }

}

function LazyMan(name) {
    return new LazyManClass(name);
}

// demo
LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(1).sleep(2).eat('junk food');
