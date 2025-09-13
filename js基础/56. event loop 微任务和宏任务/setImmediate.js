/**
 * setImmediate 和 setTimeout 的区别详解
 * 
 * 1. 执行时机：
 *    - setImmediate: 在当前事件循环的 check 阶段执行
 *    - setTimeout: 在当前事件循环的 timer 阶段执行
 * 
 * 2. 执行顺序：
 *    - 在主线程中：执行顺序不确定，取决于进程性能
 *    - 在I/O回调中：setImmediate 总是先于 setTimeout(0) 执行
 * 
 * 3. 最小延迟：
 *    - setImmediate: 无延迟，下一个事件循环立即执行
 *    - setTimeout: 最小延迟1ms（浏览器中4ms）
 */

console.log('=== setImmediate vs setTimeout 对比测试 ===\n');

// ============ 测试1: 主线程中的执行顺序 ============
console.log('1. 主线程中的执行顺序（不确定）:');
console.log('开始执行');

setTimeout(() => {
    console.log('setTimeout(0) - timer阶段');
}, 0);

setImmediate(() => {
    console.log('setImmediate - check阶段');
});

console.log('同步代码执行完毕\n');

// ============ 测试2: I/O回调中的执行顺序 ============
setTimeout(() => {
    console.log('2. I/O回调中的执行顺序（setImmediate优先）:');
    
    setTimeout(() => {
        console.log('  setTimeout(0) 在I/O回调中');
    }, 0);
    
    setImmediate(() => {
        console.log('  setImmediate 在I/O回调中');
    });
    
    console.log('  I/O回调执行完毕\n');
}, 10);

// ============ 测试3: 多个setImmediate和setTimeout ============
setTimeout(() => {
    console.log('3. 多个回调的执行顺序:');
    
    setImmediate(() => console.log('  setImmediate 1'));
    setImmediate(() => console.log('  setImmediate 2'));
    
    setTimeout(() => console.log('  setTimeout 1'), 0);
    setTimeout(() => console.log('  setTimeout 2'), 0);
    
    setImmediate(() => {
        console.log('  setImmediate 3\n');
        
        // ============ 测试4: 嵌套调用 ============
        console.log('4. 嵌套调用测试:');
        
        setImmediate(() => {
            console.log('  外层 setImmediate');
            
            setImmediate(() => {
                console.log('    内层 setImmediate');
            });
            
            setTimeout(() => {
                console.log('    内层 setTimeout');
            }, 0);
        });
        
        setTimeout(() => {
            console.log('  外层 setTimeout\n');
            
            // ============ 测试5: 性能对比 ============
            performanceTest();
        }, 0);
    });
}, 20);

// ============ 性能测试函数 ============
function performanceTest() {
    console.log('5. 性能对比测试:');
    
    const iterations = 1000;
    let setImmediateCount = 0;
    let setTimeoutCount = 0;
    
    console.time('setImmediate性能测试');
    
    function testSetImmediate() {
        setImmediateCount++;
        if (setImmediateCount < iterations) {
            setImmediate(testSetImmediate);
        } else {
            console.timeEnd('setImmediate性能测试');
            
            console.time('setTimeout性能测试');
            testSetTimeout();
        }
    }
    
    function testSetTimeout() {
        setTimeoutCount++;
        if (setTimeoutCount < iterations) {
            setTimeout(testSetTimeout, 0);
        } else {
            console.timeEnd('setTimeout性能测试');
            
            setTimeout(() => {
                console.log('\n=== 总结 ===');
                console.log('• setImmediate 在 check 阶段执行，优先级高于 setTimeout');
                console.log('• setTimeout 在 timer 阶段执行，有最小延迟限制');
                console.log('• 在 I/O 回调中，setImmediate 总是先执行');
                console.log('• setImmediate 性能通常优于 setTimeout(0)');
                console.log('• 主线程中的执行顺序取决于系统性能和负载');
            }, 10);
        }
    }
    
    testSetImmediate();
}

// ============ 事件循环阶段说明 ============
setTimeout(() => {
    console.log('\n=== Node.js 事件循环阶段 ===');
    console.log('1. Timer 阶段: 执行 setTimeout 和 setInterval 回调');
    console.log('2. Pending callbacks 阶段: 执行延迟到下一个循环的 I/O 回调');
    console.log('3. Idle, prepare 阶段: 内部使用');
    console.log('4. Poll 阶段: 获取新的 I/O 事件');
    console.log('5. Check 阶段: 执行 setImmediate 回调');
    console.log('6. Close callbacks 阶段: 执行关闭回调');
}, 50);
