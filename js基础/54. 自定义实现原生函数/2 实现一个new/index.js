// 参考资料
// https://juejin.cn/post/6877179322759643150?utm_source=gold_browser_extension%3Futm_source%3Dgold_browser_extension#heading-7


function _new(fn, ...args){

    var obj = Object.create(fn.prototype);
    var res = fn.apply(obj, [...args]);

    // 根据规范，返回 null 和 undefined 不处理，依然返回obj
    return Object.prototype.toString().call(res) === '[object Object]'? res: obj;
}