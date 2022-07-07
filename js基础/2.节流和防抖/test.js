function debounce(fn, delay, immediate) {

    let timer = null

    return (...params) => {
        if (immediate && !timer) {
            fn.apply(this, params);
        }

        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.apply(this, params);
        }, delay)
    }
}

// 节流

function throttle(fn, delay) {

    let timer = null
    let lastTime = 0

    return (...params) => {
        let nowTime = Date.now()
        let gapTime = nowTime - lastTime

        // 非第一次
        if (lastTime && gapTime < delay) {
            timer && clearTimeout(timer)

            timer = setTimeout(() => {
                lastTime = Date.now()
                fn.apply(this, params)
            }, delay - gapTime)
            return
        }

        // 第一次
        lastTime = nowTime
        fn.apply(this, params)

        timer && clearTimeout(timer)
    }
}