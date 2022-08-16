// 节流

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