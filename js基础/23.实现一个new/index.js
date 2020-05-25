function _new(fn, ...args){

    var obj = Object.create(fn.prototype);
    var res = fn.apply(obj, [...args]);

    // 根据规范，返回 null 和 undefined 不处理，依然返回obj
    return Object.prototype.toString().call(res) === '[object Object]'? res: obj;
}