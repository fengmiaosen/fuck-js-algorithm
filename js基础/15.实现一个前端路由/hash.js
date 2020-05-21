class Router {
    constructor() {
        // 储存 hash 与 callback 键值对
        this.routes = {};
        // 当前 hash
        this.currentUrl = '';
        // 记录出现过的 hash
        this.history = [];
        // 作为指针,默认指向 this.history 的末尾,根据后退前进指向 history 中不同的 hash
        this.currentIndex = this.history.length - 1;
        this.backIndex = this.history.length - 1
        this.refresh = this.refresh.bind(this);
        this.backOff = this.backOff.bind(this);
        // 默认不是后退操作
        this.isBack = false;
        window.addEventListener('load', this.refresh, false);
        window.addEventListener('hashchange', this.refresh, false);
    }

    route(path, callback) {
        this.routes[path] = callback || function () { };
    }

    refresh() {
        console.log('refresh')
        this.currentUrl = location.hash.slice(1) || '/';
        this.history.push(this.currentUrl);
        this.currentIndex++;
        if (!this.isBack) {
            this.backIndex = this.currentIndex
        }
        this.routes[this.currentUrl]();
        console.log('指针:', this.currentIndex, 'history:', this.history);
        this.isBack = false;
    }
    // 后退功能
    backOff() {
        // 后退操作设置为true
        console.log(this.currentIndex)
        console.log(this.backIndex)
        this.isBack = true;
        this.backIndex <= 0 ?
            (this.backIndex = 0) :
            (this.backIndex = this.backIndex - 1);
        location.hash = `#${this.history[this.backIndex]}`;
    }
}