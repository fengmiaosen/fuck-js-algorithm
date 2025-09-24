/**
 * 模块缓存机制演示
 * 展示模块缓存的工作原理和管理方法
 */

const path = require('path');

console.log('🗄️ 模块缓存演示开始...\n');

// 1. 查看初始缓存状态
function showCacheInfo() {
    const cache = require.cache;
    const cacheKeys = Object.keys(cache);
    
    console.log(`📊 当前缓存模块数量: ${cacheKeys.length}`);
    console.log('缓存的模块:');
    
    cacheKeys.forEach((key, index) => {
        const module = cache[key];
        const filename = path.basename(key);
        console.log(`  ${index + 1}. ${filename} - ${module.loaded ? '✅已加载' : '⏳加载中'}`);
    });
    console.log('');
}

console.log('=== 初始缓存状态 ===');
showCacheInfo();

// 2. 第一次加载模块
console.log('=== 第一次加载 basic-module ===');
const module1 = require('./basic-module');
console.log('第一次加载结果:', typeof module1);
module1.increment(); // 调用方法，计数器 +1
showCacheInfo();

// 3. 第二次加载相同模块（从缓存获取）
console.log('=== 第二次加载 basic-module ===');
const module2 = require('./basic-module');
console.log('第二次加载结果:', typeof module2);
console.log('两次加载是否为同一对象:', module1 === module2);
module2.increment(); // 计数器继续 +1
console.log('当前计数器值:', module2.getCounter());

// 4. 演示模块状态共享
console.log('\n=== 模块状态共享演示 ===');
module1.increment(); // 通过第一个引用修改状态
console.log('通过module1修改后，module2的计数器:', module2.getCounter());

// 5. 查看模块解析路径
console.log('\n=== 模块解析路径 ===');
const modulePath = require.resolve('./basic-module');
console.log('模块绝对路径:', modulePath);
console.log('模块搜索路径:', require.resolve.paths('./basic-module'));

// 6. 缓存管理操作
console.log('\n=== 缓存管理操作 ===');

// 查看特定模块的缓存信息
function getModuleCacheInfo(modulePath) {
    const cache = require.cache[modulePath];
    if (cache) {
        return {
            id: cache.id,
            filename: cache.filename,
            loaded: cache.loaded,
            parent: cache.parent ? path.basename(cache.parent.filename) : null,
            children: cache.children.map(child => path.basename(child.filename))
        };
    }
    return null;
}

const cacheInfo = getModuleCacheInfo(modulePath);
console.log('basic-module 缓存信息:', JSON.stringify(cacheInfo, null, 2));

// 7. 删除模块缓存
console.log('\n=== 删除模块缓存 ===');
console.log('删除前计数器值:', module2.getCounter());

// 删除缓存
delete require.cache[modulePath];
console.log('✅ 已删除 basic-module 的缓存');

// 重新加载模块
const module3 = require('./basic-module');
console.log('重新加载后计数器值:', module3.getCounter()); // 应该重置为0
console.log('重新加载的模块与之前是否相同:', module1 === module3);

// 8. 缓存清理工具
function clearModuleCache(pattern) {
    const cache = require.cache;
    const keysToDelete = [];
    
    Object.keys(cache).forEach(key => {
        if (pattern && key.includes(pattern)) {
            keysToDelete.push(key);
        }
    });
    
    keysToDelete.forEach(key => {
        delete cache[key];
    });
    
    return keysToDelete.length;
}

// 9. 批量清理示例模块缓存
console.log('\n=== 批量清理缓存 ===');
const clearedCount = clearModuleCache('examples');
console.log(`清理了 ${clearedCount} 个示例模块的缓存`);

// 10. 缓存监控工具
function createCacheMonitor() {
    const originalRequire = Module.prototype.require;
    const loadHistory = [];
    
    Module.prototype.require = function(id) {
        const startTime = Date.now();
        const result = originalRequire.call(this, id);
        const endTime = Date.now();
        
        loadHistory.push({
            module: id,
            loadTime: endTime - startTime,
            timestamp: new Date().toISOString(),
            fromCache: require.cache[require.resolve(id)] ? true : false
        });
        
        return result;
    };
    
    return {
        getHistory: () => loadHistory,
        reset: () => {
            loadHistory.length = 0;
            Module.prototype.require = originalRequire;
        }
    };
}

// 11. 性能测试
console.log('\n=== 缓存性能测试 ===');

function performanceTest() {
    const iterations = 1000;
    
    // 测试缓存命中性能
    console.time('缓存命中性能');
    for (let i = 0; i < iterations; i++) {
        require('./basic-module');
    }
    console.timeEnd('缓存命中性能');
    
    // 清理缓存后测试重新加载性能
    delete require.cache[require.resolve('./basic-module')];
    
    console.time('重新加载性能');
    require('./basic-module');
    console.timeEnd('重新加载性能');
}

performanceTest();

// 12. 最终缓存状态
console.log('\n=== 最终缓存状态 ===');
showCacheInfo();

// 导出缓存管理工具
module.exports = {
    showCacheInfo,
    getModuleCacheInfo,
    clearModuleCache,
    createCacheMonitor,
    performanceTest
};