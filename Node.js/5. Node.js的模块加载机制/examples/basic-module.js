/**
 * 基础模块示例
 * 演示模块的基本结构和导出方式
 */

console.log('📦 basic-module.js 开始加载...');

// 1. 模块内部变量（私有）
let privateCounter = 0;
const privateData = { secret: 'hidden' };

// 2. 模块内部函数（私有）
function privateFunction() {
    return 'This is private';
}

// 3. 公共函数
function increment() {
    privateCounter++;
    console.log(`计数器: ${privateCounter}`);
    return privateCounter;
}

function getCounter() {
    return privateCounter;
}

function reset() {
    privateCounter = 0;
    console.log('计数器已重置');
}

// 4. 类定义
class Calculator {
    constructor() {
        this.result = 0;
    }
    
    add(num) {
        this.result += num;
        return this;
    }
    
    multiply(num) {
        this.result *= num;
        return this;
    }
    
    getValue() {
        return this.result;
    }
}

// 5. 常量导出
const CONSTANTS = {
    PI: 3.14159,
    E: 2.71828,
    VERSION: '1.0.0'
};

// 6. 工具函数
const utils = {
    formatNumber: (num) => num.toLocaleString(),
    isEven: (num) => num % 2 === 0,
    randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
};

// 7. 异步函数
async function asyncOperation() {
    console.log('开始异步操作...');
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('异步操作完成');
    return 'async result';
}

// 8. 模块信息
console.log('模块信息:', {
    filename: __filename,
    dirname: __dirname,
    moduleId: module.id,
    loaded: module.loaded
});

// 9. 导出方式1: 逐个导出
exports.increment = increment;
exports.getCounter = getCounter;
exports.reset = reset;
exports.Calculator = Calculator;
exports.CONSTANTS = CONSTANTS;
exports.utils = utils;
exports.asyncOperation = asyncOperation;

// 10. 导出方式2: 批量导出（注释掉，避免冲突）
/*
module.exports = {
    increment,
    getCounter,
    reset,
    Calculator,
    CONSTANTS,
    utils,
    asyncOperation
};
*/

// 11. 模块加载完成标记
console.log('✅ basic-module.js 加载完成');

// 12. 导出模块元信息
exports.moduleInfo = {
    loadTime: new Date().toISOString(),
    filename: __filename,
    dirname: __dirname
};