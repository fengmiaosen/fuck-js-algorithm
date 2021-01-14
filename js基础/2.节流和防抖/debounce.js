
/**
 * 防抖
 * @param {*} fn 
 * @param {*} delay 
 * @param {*} immediate 
 */
function debounce(fn, delay, immediate) {

    let timer = null;

    return (...args) => {
        if (immediate && !timer) {
            fn.apply(this, args)
        }

        timer && clearTimeout(timer);

        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}