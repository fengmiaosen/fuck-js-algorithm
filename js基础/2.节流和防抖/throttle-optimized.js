/**
 * 节流函数 - 优化版本
 * Throttling: A technique to limit the execution rate of a function.
 * It ensures that a function is called at most once in a specified time period.
 * 
 * 节流(throttle)：限制函数在一定时间内只能执行一次
 * 常用场景：
 * 1. 滚动事件处理 (scroll events)
 * 2. 窗口大小调整 (window resize)
 * 3. 按钮连续点击 (continuous button clicks)
 * 4. 搜索框输入联想 (search input suggestions)
 */

/**
 * 节流函数 - 完整功能版本
 * @param {Function} fn - 需要节流的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @param {Object} options - 配置选项
 * @param {boolean} options.leading - 是否在开始时立即执行（默认 true）
 * @param {boolean} options.trailing - 是否在结束时执行（默认 true）
 * @returns {Function} 节流后的函数
 */
function throttle(fn, delay, options = {}) {
    // 参数验证
    if (typeof fn !== 'function') {
        throw new TypeError('Expected a function');
    }
    if (typeof delay !== 'number' || delay < 0) {
        throw new TypeError('Expected delay to be a non-negative number');
    }

    const { leading = true, trailing = true } = options;
    let timer = null;
    let lastTime = 0;
    let lastArgs = null;
    let lastThis = null;

    // 清理定时器的辅助函数
    const clearTimer = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    // 执行函数的辅助函数
    const invokeFunc = (time) => {
        lastTime = time;
        clearTimer();
        return fn.apply(lastThis, lastArgs);
    };

    // 设置尾部调用的定时器
    const setTrailingTimer = (remainingTime) => {
        timer = setTimeout(() => {
            lastTime = leading ? Date.now() : 0;
            timer = null;
            fn.apply(lastThis, lastArgs);
            // 清理引用，避免内存泄漏
            if (!timer) {
                lastArgs = lastThis = null;
            }
        }, remainingTime);
    };

    const throttled = function (...args) {
        const now = Date.now();
        const isFirstCall = !lastTime;
        
        // 保存当前调用的上下文和参数
        lastThis = this;
        lastArgs = args;

        // 如果是第一次调用且不需要立即执行，设置 lastTime
        if (isFirstCall && !leading) {
            lastTime = now;
        }

        const remainingTime = delay - (now - lastTime);

        // 如果是第一次调用且需要立即执行，或者已经超过延迟时间
        if (isFirstCall && leading || remainingTime <= 0) {
            clearTimer();
            return invokeFunc(now);
        }

        // 如果需要尾部执行且没有设置定时器
        if (trailing && !timer) {
            setTrailingTimer(remainingTime);
        }
    };

    // 添加取消方法
    throttled.cancel = function () {
        clearTimer();
        lastTime = 0;
        lastArgs = lastThis = null;
    };

    // 添加立即执行方法
    throttled.flush = function () {
        if (timer) {
            clearTimer();
            return fn.apply(lastThis, lastArgs);
        }
    };

    return throttled;
}

/**
 * 简化版节流函数（仅支持 leading 模式）
 * @param {Function} fn - 需要执行的函数
 * @param {number} wait - 时间间隔（默认 50ms）
 * @returns {Function} 节流后的函数
 */
function throttleSimple(fn, wait = 50) {
    // 参数验证
    if (typeof fn !== 'function') {
        throw new TypeError('Expected a function');
    }
    
    let previous = 0;
    
    return function (...args) {
        const now = Date.now();
        
        // 将当前时间和上一次执行函数的时间进行对比
        // 大于等待时间就把 previous 设置为当前时间并执行函数 fn
        if (now - previous > wait) {
            previous = now;
            return fn.apply(this, args);
        }
    };
}

/**
 * 性能测试和对比示例
 */
function performanceTest() {
    console.log('\n=== 节流函数性能测试 ===');
    
    const testFn = () => {}; // 空函数用于测试
    const iterations = 100000;
    
    // 测试优化版本
    console.time('优化版 throttle');
    const optimizedThrottle = throttle(testFn, 100);
    for (let i = 0; i < iterations; i++) {
        optimizedThrottle();
    }
    console.timeEnd('优化版 throttle');
    
    // 测试简化版本
    console.time('简化版 throttleSimple');
    const simpleThrottle = throttleSimple(testFn, 100);
    for (let i = 0; i < iterations; i++) {
        simpleThrottle();
    }
    console.timeEnd('简化版 throttleSimple');
}

/**
 * 实际应用示例
 */
function createRealWorldExamples() {
    // 滚动事件节流
    const handleScroll = throttle(() => {
        if (typeof window !== 'undefined') {
            console.log('页面滚动位置:', window.scrollY);
        }
    }, 100);
    
    // 窗口大小调整节流
    const handleResize = throttle(() => {
        if (typeof window !== 'undefined') {
            console.log('窗口大小:', window.innerWidth, 'x', window.innerHeight);
        }
    }, 200);
    
    // 搜索输入节流
    const handleSearch = throttle((query) => {
        console.log('搜索查询:', query);
        // 这里可以发送 API 请求
    }, 300, { leading: false, trailing: true });
    
    // 按钮点击节流（防止重复提交）
    const handleSubmit = throttle(() => {
        console.log('表单提交');
        // 这里可以发送表单数据
    }, 1000, { leading: true, trailing: false });
    
    // API 请求节流
    const handleApiCall = throttle(async (url, data) => {
        console.log('发送 API 请求:', url);
        // 模拟 API 请求
        try {
            // const response = await fetch(url, { method: 'POST', body: JSON.stringify(data) });
            // return response.json();
            return { success: true, data: 'mock response' };
        } catch (error) {
            console.error('API 请求失败:', error);
            throw error;
        }
    }, 500);
    
    return {
        handleScroll,
        handleResize,
        handleSearch,
        handleSubmit,
        handleApiCall
    };
}

// 使用示例
function usageExamples() {
    console.log('\n=== 节流函数使用示例 ===');
    
    // 基础用法
    const basicThrottle = throttle(() => {
        console.log('基础节流函数执行了');
    }, 1000);
    
    // 高级用法示例
    const advancedThrottle = throttle(
        (msg) => console.log('高级节流函数执行了:', msg),
        1000,
        { leading: true, trailing: true }
    );
    
    // 只在开始时执行，不在结束时执行
    const leadingOnlyThrottle = throttle(
        () => console.log('只在开始时执行'),
        1000,
        { leading: true, trailing: false }
    );
    
    // 只在结束时执行，不在开始时执行
    const trailingOnlyThrottle = throttle(
        () => console.log('只在结束时执行'),
        1000,
        { leading: false, trailing: true }
    );
    
    // 使用取消和立即执行功能
    const cancellableThrottle = throttle(() => {
        console.log('可取消的节流函数');
    }, 2000);
    
    return {
        basicThrottle,
        advancedThrottle,
        leadingOnlyThrottle,
        trailingOnlyThrottle,
        cancellableThrottle
    };
}

// 导出函数（支持多种模块系统）
if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = {
        throttle,
        throttleSimple,
        performanceTest,
        createRealWorldExamples,
        usageExamples
    };
} else if (typeof define === 'function' && define.amd) {
    // AMD
    define([], function() {
        return {
            throttle,
            throttleSimple,
            performanceTest,
            createRealWorldExamples,
            usageExamples
        };
    });
} else if (typeof window !== 'undefined') {
    // 浏览器全局变量
    window.ThrottleUtils = {
        throttle,
        throttleSimple,
        performanceTest,
        createRealWorldExamples,
        usageExamples
    };
}

// 如果直接运行此文件，执行示例
if (typeof require !== 'undefined' && require.main === module) {
    console.log('运行节流函数示例...');
    
    // 运行性能测试
    // performanceTest();
    
    // 创建实际应用示例
    const examples = createRealWorldExamples();
    console.log('实际应用示例已创建:', Object.keys(examples));
    
    // 创建使用示例
    const usage = usageExamples();
    console.log('使用示例已创建:', Object.keys(usage));
}