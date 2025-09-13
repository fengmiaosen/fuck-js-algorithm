// Throttling: A technique to limit the execution rate of a function.
// It ensures that a function is called at most once in a specified time period.
// Common use cases: scroll events, window resize, continuous button clicks
// 节流(throttle)：限制函数在一定时间内只能执行一次
// 常用场景：
// 1. 滚动事件处理 (scroll events)
// 2. 窗口大小调整 (window resize)
// 3. 按钮连续点击 (continuous button clicks)
// 4. 搜索框输入联想 (search input suggestions)

// 实现：
// 1. 首次立即执行
// 2. 非首次，判断时间间隔是否大于指定时间间隔
// 3. 大于，执行函数，更新时间
// 4. 小于，等待

function throttle(fn, delay) {

    let timer = null;
    let lastTime = 0;

    return (...args) => {

        const nowTime = Date.now();
        const gapTime = nowTime - lastTime;

        // 非首次
        if (lastTime && gapTime < delay) {
            timer && clearTimeout(timer);

            timer = setTimeout(() => {
                // 计时器回调函数执行完毕，更新lastTime用于下一次比较
                lastTime = Date.now();

                fn.apply(this, args);
            }, delay - gapTime);

            return;
        }

        //第一次
        lastTime = nowTime;
        fn.apply(this, args);
        timer && clearTimeout(timer);

    }
}

// DEMO
// 执行 throttle 函数返回新函数
const betterFn1 = throttle(() => console.log('fn 函数执行了'), 1000)
// 每 10 毫秒执行一次 betterFn 函数，但是只有时间差大于 1000 时才会执行 fn
setInterval(betterFn1, 10)

// fn 是需要执行的函数
// wait 是时间间隔
const throttle2 = (fn, wait = 50) => {
    // 上一次执行 fn 的时间
    let previous = 0
    // 将 throttle 处理结果当作函数返回
    return function (...args) {
        // 获取当前时间，转换成时间戳，单位毫秒
        let now = +new Date()
        // 将当前时间和上一次执行函数的时间进行对比
        // 大于等待时间就把 previous 设置为当前时间并执行函数 fn
        if (now - previous > wait) {
            previous = now
            fn.apply(this, args)
        }
    }
}

// // DEMO
// // 执行 throttle 函数返回新函数
// const betterFn = throttle2(() => console.log('fn 函数执行了'), 1000)
// // 每 10 毫秒执行一次 betterFn 函数，但是只有时间差大于 1000 时才会执行 fn
// setInterval(betterFn, 10)