function _new(fn, ...args){

    var obj = Object.create(fn.prototype);
    var res = fn.apply(obj, [...args]);

    return Object.prototype.toString().call(res) === '[object Object]'? res: obj;
}