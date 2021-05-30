const getInstance = (function () {

    let instance = null;

    return function (name) {
        if (!instance) {
            this.name = name;
            instance = this;
        }

        return instance;
    }
})();

let a = new getInstance('aa')
let b = new getInstance('bbbb')
console.log(a)
console.log(b)