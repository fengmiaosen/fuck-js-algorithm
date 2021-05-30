// https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/25

// 目标类
class Subject {
    constructor() {
        this.observers = [];
    }

    add(observer) {
        this.observers.push(observer);
    }

    remove(observer) {
        const idx = this.observers.findIndex(obj => obj === observer);

        idx > -1 && this.observers.splice(idx, 1);
    }

    notify() {
        for(let obj of this.observers){
            obj.update();
        }
    }
}

// 观察者类
class Observer {
    constructor(name) {
        this.name = name;
    }

    update() {
        console.log(`目标者通知我更新了，我是：${this.name}`);
    }
}

// 目标实例对象
const sub = new Subject();

// 两个观察者实例对象
const obj1 = new Observer('obj111');
const obj2 = new Observer('obj222')

sub.add(obj1);
sub.add(obj2);

sub.notify();
