/**
 * ES6 模块示例 (.mjs 文件)
 * 演示 ES6 模块语法和特性
 */

console.log('📦 ES6 模块加载中...');

// 命名导出
export const PI = 3.14159;
export const E = 2.71828;

// 函数导出
export function add(a, b) {
    return a + b;
}

export function multiply(a, b) {
    return a * b;
}

// 类导出
export class Calculator {
    constructor() {
        this.history = [];
    }
    
    calculate(operation, a, b) {
        let result;
        switch (operation) {
            case 'add':
                result = add(a, b);
                break;
            case 'multiply':
                result = multiply(a, b);
                break;
            default:
                throw new Error(`Unknown operation: ${operation}`);
        }
        
        this.history.push({ operation, a, b, result });
        return result;
    }
    
    getHistory() {
        return this.history;
    }
}

// 异步函数导出
export async function fetchData(url) {
    // 模拟异步操作
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ url, data: `Data from ${url}`, timestamp: Date.now() });
        }, 100);
    });
}

// 对象导出
export const config = {
    version: '1.0.0',
    debug: true,
    features: ['ES6', 'async/await', 'classes']
};

// 默认导出
const utils = {
    formatNumber: (num) => num.toLocaleString(),
    formatDate: (date) => date.toISOString().split('T')[0],
    randomId: () => Math.random().toString(36).substr(2, 9)
};

export default utils;

// 模块级别的代码
console.log('✅ ES6 模块加载完成');

// 导出模块信息（ES6 模块中没有 module 对象）
export const moduleInfo = {
    type: 'ES6 Module',
    file: import.meta.url,
    loadTime: new Date().toISOString()
};