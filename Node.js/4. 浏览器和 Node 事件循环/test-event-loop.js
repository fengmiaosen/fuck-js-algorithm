/**
 * 事件循环测试文件
 * 用于验证和学习事件循环的执行顺序
 */

// ==================== 测试用例1: 基础顺序验证 ====================
function testBasicOrder() {
    console.log('\n🧪 测试1: 基础执行顺序');
    
    const results = [];
    const originalLog = console.log;
    
    // 劫持console.log来收集输出
    console.log = function(msg) {
        if (typeof msg === 'string' && msg.includes('.')) {
            results.push(msg);
        }
        originalLog(msg);
    };
    
    // 执行测试
    console.log('1. 同步开始');
    
    setTimeout(() => {
        console.log('4. 宏任务');
        
        // 恢复console.log并验证结果
        setTimeout(() => {
            console.log = originalLog;
            const expected = ['1. 同步开始', '2. 同步结束', '3. 微任务', '4. 宏任务'];
            const passed = JSON.stringify(results) === JSON.stringify(expected);
            console.log(`✅ 测试1结果: ${passed ? '通过' : '失败'}`);
            if (!passed) {
                console.log('期望:', expected);
                console.log('实际:', results);
            }
        }, 10);
    }, 0);
    
    Promise.resolve().then(() => {
        console.log('3. 微任务');
    });
    
    console.log('2. 同步结束');
}

// ==================== 测试用例2: 微任务优先级 ====================
function testMicroTaskPriority() {
    console.log('\n🧪 测试2: 微任务优先级');
    
    const executionOrder = [];
    
    setTimeout(() => {
        executionOrder.push('macro1');
        console.log('宏任务1执行');
    }, 0);
    
    Promise.resolve().then(() => {
        executionOrder.push('micro1');
        console.log('微任务1执行');
        
        Promise.resolve().then(() => {
            executionOrder.push('micro2');
            console.log('微任务2执行');
        });
    });
    
    setTimeout(() => {
        executionOrder.push('macro2');
        console.log('宏任务2执行');
        
        // 验证执行顺序
        setTimeout(() => {
            const expected = ['micro1', 'micro2', 'macro1', 'macro2'];
            const passed = JSON.stringify(executionOrder) === JSON.stringify(expected);
            console.log(`✅ 测试2结果: ${passed ? '通过' : '失败'}`);
            if (!passed) {
                console.log('期望:', expected);
                console.log('实际:', executionOrder);
            }
        }, 10);
    }, 0);
}

// ==================== 测试用例3: async/await 行为 ====================
async function testAsyncAwait() {
    console.log('\n🧪 测试3: async/await 行为');
    
    const order = [];
    
    async function asyncFunc() {
        order.push('async-start');
        await Promise.resolve();
        order.push('async-after-await');
    }
    
    order.push('sync-start');
    
    asyncFunc();
    
    Promise.resolve().then(() => {
        order.push('promise-then');
    });
    
    order.push('sync-end');
    
    // 等待所有异步操作完成
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const expected = ['sync-start', 'async-start', 'sync-end', 'async-after-await', 'promise-then'];
    const passed = JSON.stringify(order) === JSON.stringify(expected);
    console.log(`✅ 测试3结果: ${passed ? '通过' : '失败'}`);
    if (!passed) {
        console.log('期望:', expected);
        console.log('实际:', order);
    }
}

// ==================== 测试用例4: 错误处理 ====================
function testErrorHandling() {
    console.log('\n🧪 测试4: 错误处理');
    
    let microTaskErrorCaught = false;
    let macroTaskErrorCaught = false;
    
    // 微任务错误处理
    Promise.resolve().then(() => {
        throw new Error('微任务错误');
    }).catch(() => {
        microTaskErrorCaught = true;
        console.log('微任务错误被捕获');
    });
    
    // 宏任务错误处理
    setTimeout(() => {
        try {
            throw new Error('宏任务错误');
        } catch (e) {
            macroTaskErrorCaught = true;
            console.log('宏任务错误被捕获');
            
            // 验证结果
            setTimeout(() => {
                const passed = microTaskErrorCaught && macroTaskErrorCaught;
                console.log(`✅ 测试4结果: ${passed ? '通过' : '失败'}`);
            }, 10);
        }
    }, 0);
}

// ==================== 性能测试 ====================
function performanceTest() {
    console.log('\n🧪 性能测试: 微任务 vs 宏任务');
    
    const iterations = 1000;
    
    // 微任务性能测试
    const microStart = performance.now();
    let microCount = 0;
    
    for (let i = 0; i < iterations; i++) {
        Promise.resolve().then(() => {
            microCount++;
            if (microCount === iterations) {
                const microEnd = performance.now();
                console.log(`微任务执行${iterations}次耗时: ${(microEnd - microStart).toFixed(2)}ms`);
            }
        });
    }
    
    // 宏任务性能测试
    const macroStart = performance.now();
    let macroCount = 0;
    
    for (let i = 0; i < iterations; i++) {
        setTimeout(() => {
            macroCount++;
            if (macroCount === iterations) {
                const macroEnd = performance.now();
                console.log(`宏任务执行${iterations}次耗时: ${(macroEnd - macroStart).toFixed(2)}ms`);
            }
        }, 0);
    }
}

// ==================== Node.js 特殊测试 ====================
function testNodeSpecific() {
    if (typeof process === 'undefined' || !process.nextTick) {
        console.log('\n⚠️  当前环境不支持 Node.js 特殊API');
        return;
    }
    
    console.log('\n🧪 Node.js 特殊测试');
    
    const order = [];
    
    setTimeout(() => {
        order.push('setTimeout');
    }, 0);
    
    setImmediate(() => {
        order.push('setImmediate');
        
        // 验证结果
        setTimeout(() => {
            console.log('Node.js 执行顺序:', order);
            // 在Node.js中，setImmediate通常在setTimeout之后执行
            const passed = order.indexOf('setTimeout') < order.indexOf('setImmediate');
            console.log(`✅ Node.js测试结果: ${passed ? '通过' : '失败'}`);
        }, 10);
    });
    
    process.nextTick(() => {
        order.push('nextTick');
    });
    
    Promise.resolve().then(() => {
        order.push('Promise');
    });
}

// ==================== 运行所有测试 ====================
async function runAllTests() {
    console.log('🚀 开始事件循环测试套件\n');
    
    testBasicOrder();
    
    setTimeout(() => {
        testMicroTaskPriority();
    }, 100);
    
    setTimeout(async () => {
        await testAsyncAwait();
    }, 200);
    
    setTimeout(() => {
        testErrorHandling();
    }, 300);
    
    setTimeout(() => {
        performanceTest();
    }, 400);
    
    setTimeout(() => {
        testNodeSpecific();
    }, 500);
    
    setTimeout(() => {
        console.log('\n🎉 所有测试完成！');
    }, 1000);
}

// ==================== 交互式学习工具 ====================
function createInteractiveLearning() {
    console.log('\n📚 交互式学习工具');
    
    const scenarios = [
        {
            name: '场景1: 基础混合',
            code: `
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
            `,
            expected: ['1', '4', '3', '2']
        },
        {
            name: '场景2: 嵌套Promise',
            code: `
Promise.resolve().then(() => {
    console.log('1');
    Promise.resolve().then(() => console.log('2'));
});
Promise.resolve().then(() => console.log('3'));
            `,
            expected: ['1', '3', '2']
        }
    ];
    
    scenarios.forEach((scenario, index) => {
        setTimeout(() => {
            console.log(`\n${scenario.name}:`);
            console.log('代码:', scenario.code.trim());
            console.log('预期输出:', scenario.expected.join(' → '));
            
            // 实际执行（这里只是演示，实际项目中可以用eval，但要注意安全性）
            console.log('💡 提示: 先思考执行顺序，再运行代码验证');
        }, index * 200);
    });
}

// 如果直接运行此文件，执行所有测试
if (require.main === module) {
    runAllTests();
    
    setTimeout(() => {
        createInteractiveLearning();
    }, 1200);
}

// 导出测试函数
module.exports = {
    testBasicOrder,
    testMicroTaskPriority,
    testAsyncAwait,
    testErrorHandling,
    performanceTest,
    testNodeSpecific,
    runAllTests,
    createInteractiveLearning
};