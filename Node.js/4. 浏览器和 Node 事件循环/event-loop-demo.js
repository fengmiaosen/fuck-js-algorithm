/**
 * JavaScript 事件循环演示代码
 * 展示微任务和宏任务的执行顺序
 */

console.log('=== JavaScript 事件循环演示 ===\n');

// ==================== 示例1: 基础执行顺序 ====================
console.log('📍 示例1: 基础执行顺序');

function basicExample() {
    console.log('1. 同步代码开始');
    
    setTimeout(() => {
        console.log('4. 宏任务 - setTimeout');
    }, 0);
    
    Promise.resolve().then(() => {
        console.log('3. 微任务 - Promise.then');
    });
    
    console.log('2. 同步代码结束');
}

basicExample();

// 延迟执行下一个示例
setTimeout(() => {
    console.log('\n📍 示例2: 复杂嵌套场景');
    
    // ==================== 示例2: 复杂嵌套场景 ====================
    function complexExample() {
        console.log('1. script start');
        
        setTimeout(() => {
            console.log('8. timeout1');
            Promise.resolve().then(() => {
                console.log('9. promise in timeout1');
            });
        }, 0);
        
        Promise.resolve().then(() => {
            console.log('4. promise1');
            setTimeout(() => {
                console.log('10. timeout in promise1');
            }, 0);
        }).then(() => {
            console.log('5. promise1.then');
        });
        
        setTimeout(() => {
            console.log('11. timeout2');
        }, 0);
        
        Promise.resolve().then(() => {
            console.log('6. promise2');
        });
        
        new Promise(resolve => {
            console.log('2. promise executor');
            resolve();
        }).then(() => {
            console.log('7. promise3');
        });
        
        console.log('3. script end');
    }
    
    complexExample();
}, 100);

// ==================== 示例3: async/await 场景 ====================
setTimeout(() => {
    console.log('\n📍 示例3: async/await 场景');
    
    async function async1() {
        console.log('2. async1 start');
        await async2();
        console.log('6. async1 end');
    }
    
    async function async2() {
        console.log('3. async2');
    }
    
    function asyncAwaitExample() {
        console.log('1. script start');
        
        setTimeout(() => {
            console.log('8. setTimeout');
        }, 0);
        
        async1();
        
        new Promise(resolve => {
            console.log('4. promise1');
            resolve();
        }).then(() => {
            console.log('7. promise2');
        });
        
        console.log('5. script end');
    }
    
    asyncAwaitExample();
}, 200);

// ==================== 示例4: 微任务队列清空演示 ====================
setTimeout(() => {
    console.log('\n📍 示例4: 微任务队列清空演示');
    
    function microTaskQueueExample() {
        console.log('1. start');
        
        setTimeout(() => {
            console.log('7. macro task 1');
        }, 0);
        
        Promise.resolve().then(() => {
            console.log('3. micro task 1');
            Promise.resolve().then(() => {
                console.log('4. micro task 2');
                Promise.resolve().then(() => {
                    console.log('5. micro task 3');
                });
            });
        });
        
        setTimeout(() => {
            console.log('8. macro task 2');
        }, 0);
        
        Promise.resolve().then(() => {
            console.log('6. micro task 4');
        });
        
        console.log('2. end');
    }
    
    microTaskQueueExample();
}, 300);

// ==================== 示例5: 性能测试 ====================
setTimeout(() => {
    console.log('\n📍 示例5: 性能测试 - 微任务 vs 宏任务');
    
    function performanceTest() {
        const iterations = 1000;
        
        // 测试微任务性能
        console.time('微任务执行时间');
        for (let i = 0; i < iterations; i++) {
            Promise.resolve().then(() => {
                if (i === iterations - 1) {
                    console.timeEnd('微任务执行时间');
                }
            });
        }
        
        // 测试宏任务性能
        console.time('宏任务执行时间');
        for (let i = 0; i < iterations; i++) {
            setTimeout(() => {
                if (i === iterations - 1) {
                    console.timeEnd('宏任务执行时间');
                }
            }, 0);
        }
    }
    
    performanceTest();
}, 400);

// ==================== 示例6: 实际应用场景 ====================
setTimeout(() => {
    console.log('\n📍 示例6: 实际应用场景');
    
    // 模拟DOM操作
    function simulateDOMOperation() {
        console.log('1. 开始DOM操作');
        
        // 模拟批量DOM更新
        const elements = ['div1', 'div2', 'div3'];
        elements.forEach(el => {
            console.log(`2. 更新元素: ${el}`);
        });
        
        // 使用微任务确保DOM更新后执行
        Promise.resolve().then(() => {
            console.log('3. DOM更新完成，执行回调');
            
            // 模拟动画触发
            Promise.resolve().then(() => {
                console.log('4. 触发动画');
            });
        });
        
        // 使用宏任务避免阻塞
        setTimeout(() => {
            console.log('5. 执行非关键任务');
        }, 0);
    }
    
    simulateDOMOperation();
}, 500);

// ==================== 示例7: 错误处理 ====================
setTimeout(() => {
    console.log('\n📍 示例7: 错误处理');
    
    function errorHandlingExample() {
        console.log('1. 开始错误处理示例');
        
        // 微任务中的错误
        Promise.resolve().then(() => {
            console.log('2. 微任务执行');
            throw new Error('微任务中的错误');
        }).catch(err => {
            console.log('3. 捕获微任务错误:', err.message);
        });
        
        // 宏任务中的错误
        setTimeout(() => {
            console.log('4. 宏任务执行');
            try {
                throw new Error('宏任务中的错误');
            } catch (err) {
                console.log('5. 捕获宏任务错误:', err.message);
            }
        }, 0);
        
        console.log('6. 同步代码继续执行');
    }
    
    errorHandlingExample();
}, 600);

// ==================== 工具函数：可视化事件循环 ====================
function visualizeEventLoop(name, callback) {
    console.log(`\n🔄 ${name} - 事件循环可视化:`);
    console.log('执行栈 -> 微任务队列 -> 宏任务队列');
    
    let step = 1;
    const originalLog = console.log;
    
    console.log = function(...args) {
        originalLog(`[步骤${step++}]`, ...args);
    };
    
    callback();
    
    setTimeout(() => {
        console.log = originalLog;
    }, 100);
}

// ==================== Node.js 特殊情况演示 ====================
if (typeof process !== 'undefined' && process.nextTick) {
    setTimeout(() => {
        console.log('\n📍 Node.js 特殊情况演示');
        
        function nodeSpecialExample() {
            console.log('1. script start');
            
            setTimeout(() => {
                console.log('6. setTimeout');
            }, 0);
            
            setImmediate(() => {
                console.log('7. setImmediate');
            });
            
            process.nextTick(() => {
                console.log('3. process.nextTick 1');
                process.nextTick(() => {
                    console.log('4. process.nextTick 2');
                });
            });
            
            Promise.resolve().then(() => {
                console.log('5. Promise.then');
            });
            
            console.log('2. script end');
        }
        
        nodeSpecialExample();
    }, 700);
}

// ==================== 总结 ====================
setTimeout(() => {
    console.log('\n🎯 总结:');
    console.log('1. 同步代码总是最先执行');
    console.log('2. 微任务在每个宏任务之前执行');
    console.log('3. 微任务队列会被完全清空');
    console.log('4. 然后执行下一个宏任务');
    console.log('5. Node.js中process.nextTick优先级最高');
    console.log('\n执行顺序: 同步代码 → 微任务 → 宏任务 → 重复');
}, 1000);

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        basicExample,
        visualizeEventLoop
    };
}