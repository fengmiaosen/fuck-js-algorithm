// 防抖
function debounce(fn, delay){

    let timer = null;

    return (...args) => {

        timer && clearTimeout(timer);

        timer = setTimeout(() => {
            fn.applay(this, args);
        }, delay);
    };
}