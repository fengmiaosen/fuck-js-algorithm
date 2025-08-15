
/**
 * 防抖函数
 *
 * 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。
 * 适用于输入框搜索、窗口大小调整等场景。
 *
 * @param {Function} fn - 需要进行防抖处理的函数。
 * @param {number} delay - 延迟执行的时间，单位为毫秒。
 * @param {boolean} [immediate=false] - 是否在第一次触发时立即执行。
 *        - `true`: 立即执行一次，然后进入冷却期，在冷却期内的所有触发都会被忽略。
 *        - `false`: 延迟执行，在最后一次触发后的 `delay` 毫秒后执行。
 * @returns {Function} - 返回一个新的防抖函数。
 */
function debounce(fn, delay, immediate = false) {
    // 参数校验
    if (typeof fn !== 'function') {
        throw new TypeError('第一个参数必须是函数');
    }
    if (typeof delay !== 'number') {
        throw new TypeError('第二个参数必须是数字');
    }
    
    let timer = null; // 用于存储定时器ID
    let isInvoked = false; // 标记是否已经立即执行过

    // 返回一个新的函数，这个函数会作为事件处理函数
    return function(...args) {
        const context = this; // 保存函数调用的上下文

        // 如果设置了立即执行，并且是第一次调用
        if (immediate && !isInvoked) {
            fn.apply(context, args); // 立即执行函数
            isInvoked = true; // 标记已经执行过
        }

        // 每次触发时，都清除之前的定时器
        // 这确保了只有在最后一次触发之后，函数才会被执行
        if (timer) {
            clearTimeout(timer);
        }

        // 设置一个新的定时器
        timer = setTimeout(() => {
            // 如果不是立即执行模式，则在这里执行函数
            if (!immediate) {
                fn.apply(context, args);
            }
            // 延迟时间过后，重置isInvoked状态，允许下一次的立即执行
            isInvoked = false;
            timer = null; // 清除定时器ID
        }, delay);
    };
}