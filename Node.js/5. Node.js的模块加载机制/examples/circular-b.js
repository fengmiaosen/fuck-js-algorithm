/**
 * 循环依赖示例 - 模块B
 * 演示循环依赖的问题和解决方案
 */

console.log('🔄 模块B开始加载...');

// 1. 立即引用模块A（形成循环依赖）
console.log('模块B: 准备引用模块A');
const moduleA = require('./circular-a');
console.log('模块B: 获得模块A引用:', typeof moduleA);

// 2. 模块B的功能
const moduleB = {
    name: 'Module B',
    value: 200,
    
    // 直接调用模块A的方法
    callA: function() {
        console.log('模块B调用模块A的方法');
        if (moduleA && moduleA.getValue) {
            return moduleA.getValue();
        } else {
            console.log('⚠️ 模块A还未完全加载');
            return null;
        }
    },
    
    // 延迟调用模块A的方法
    callALater: function() {
        console.log('模块B延迟调用模块A的方法');
        const a = require('./circular-a'); // 重新require
        return a.getValue ? a.getValue() : null;
    },
    
    getValue: function() {
        return this.value;
    }
};

// 3. 导出模块B
module.exports = moduleB;

console.log('✅ 模块B加载完成');

// 4. 测试循环依赖
setTimeout(() => {
    console.log('\n--- 模块B延迟测试循环依赖 ---');
    console.log('模块B调用模块A:', moduleB.callA());
    console.log('模块B延迟调用模块A:', moduleB.callALater());
}, 200);