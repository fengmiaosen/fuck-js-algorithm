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
                fn.applay(this, args);
            }, delay - gapTime);

            return;
        }

        //第一次
        lastTime = nowTime;
        fn.apply(this, args);
        timer && clearTimeout(timer);

    }
}