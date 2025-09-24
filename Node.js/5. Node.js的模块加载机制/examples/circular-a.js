/**
 * 循环依赖示例 - 模块A
 * 演示循环依赖的问题和解决方案
 */

console.log('🔄 模块A开始加载...');

// 1. 立即引用模块B（会导致循环依赖）
console.log('模块A: 准备引用模块B');
const moduleB = require('./circular-b');
console.log('模块A: 获得模块B引用:', typeof moduleB);

// 2. 模块A的功能
const moduleA = {
    name: 'Module A',
    value: 100,
    
    // 直接调用模块B的方法
    callB: function() {
        console.log('模块A调用模块B的方法');
        if (moduleB && moduleB.getValue) {
            return moduleB.getValue();
        } else {
            console.log('⚠️ 模块B还未完全加载');
            return null;
        }
    },
    
    // 延迟调用模块B的方法
    callBLater: function() {
        console.log('模块A延迟调用模块B的方法');
        const b = require('./circular-b'); // 重新require
        return b.getValue ? b.getValue() : null;
    },
    
    getValue: function() {
        return this.value;
    }
};

// 3. 导出模块A
module.exports = moduleA;

console.log('✅ 模块A加载完成');

// 4. 测试循环依赖
setTimeout(() => {
    console.log('\n--- 延迟测试循环依赖 ---');
    console.log('模块A调用模块B:', moduleA.callB());
    console.log('模块A延迟调用模块B:', moduleA.callBLater());
}, 100);