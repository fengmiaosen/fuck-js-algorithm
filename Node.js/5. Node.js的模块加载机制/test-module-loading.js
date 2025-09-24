/**
 * Node.js 模块加载机制综合测试
 * 测试各种模块加载场景和机制
 */

const path = require('path');
const fs = require('fs');

console.log('🧪 Node.js 模块加载机制综合测试\n');

/**
 * 测试1: 基础模块加载
 */
function testBasicModuleLoading() {
    console.log('=== 测试1: 基础模块加载 ===');
    
    try {
        // 加载自定义模块
        const basicModule = require('./examples/basic-module');
        console.log('✅ 基础模块加载成功');
        console.log('模块类型:', typeof basicModule);
        console.log('导出内容:', Object.keys(basicModule));
        
        // 测试模块功能
        if (basicModule.increment && basicModule.getCounter) {
            console.log('初始计数:', basicModule.getCounter());
            basicModule.increment();
            basicModule.increment();
            console.log('递增后计数:', basicModule.getCounter());
        }
        
        // 测试常量
        if (basicModule.PI) {
            console.log('PI 常量:', basicModule.PI);
        }
        
        // 测试工具函数
        if (basicModule.formatDate) {
            console.log('格式化日期:', basicModule.formatDate(new Date()));
        }
        
    } catch (err) {
        console.error('❌ 基础模块加载失败:', err.message);
    }
    
    console.log('');
}

/**
 * 测试2: 模块缓存机制
 */
function testModuleCache() {
    console.log('=== 测试2: 模块缓存机制 ===');
    
    try {
        // 第一次加载
        console.log('第一次加载模块...');
        const module1 = require('./examples/basic-module');
        
        // 第二次加载
        console.log('第二次加载模块...');
        const module2 = require('./examples/basic-module');
        
        // 验证是否为同一个对象
        console.log('两次加载是否为同一对象:', module1 === module2);
        
        // 修改模块状态
        if (module1.increment) {
            module1.increment();
            console.log('模块1计数:', module1.getCounter());
            console.log('模块2计数:', module2.getCounter());
            console.log('状态是否共享:', module1.getCounter() === module2.getCounter());
        }
        
        // 查看缓存
        const cacheKeys = Object.keys(require.cache);
        console.log('缓存中的模块数量:', cacheKeys.length);
        
        // 查找我们的模块
        const ourModule = cacheKeys.find(key => key.includes('basic-module'));
        if (ourModule) {
            console.log('模块在缓存中的路径:', path.basename(ourModule));
            console.log('模块已加载:', require.cache[ourModule].loaded);
        }
        
    } catch (err) {
        console.error('❌ 模块缓存测试失败:', err.message);
    }
    
    console.log('');
}

/**
 * 测试3: 循环依赖处理
 */
function testCircularDependency() {
    console.log('=== 测试3: 循环依赖处理 ===');
    
    try {
        console.log('加载循环依赖模块 A...');
        const moduleA = require('./examples/circular-a');
        
        console.log('模块 A 导出:', Object.keys(moduleA));
        
        if (moduleA.testCircular) {
            console.log('测试循环依赖:');
            moduleA.testCircular();
        }
        
        // 验证模块 B 也被正确加载
        console.log('直接加载模块 B...');
        const moduleB = require('./examples/circular-b');
        console.log('模块 B 导出:', Object.keys(moduleB));
        
        if (moduleB.testCircular) {
            console.log('从模块 B 测试循环依赖:');
            moduleB.testCircular();
        }
        
    } catch (err) {
        console.error('❌ 循环依赖测试失败:', err.message);
    }
    
    console.log('');
}

/**
 * 测试4: 路径解析机制
 */
function testPathResolution() {
    console.log('=== 测试4: 路径解析机制 ===');
    
    try {
        // 测试相对路径
        console.log('测试相对路径解析:');
        const resolved1 = require.resolve('./examples/basic-module');
        console.log('相对路径解析结果:', path.basename(resolved1));
        
        // 测试绝对路径
        console.log('测试绝对路径解析:');
        const absolutePath = path.join(__dirname, 'examples', 'basic-module');
        const resolved2 = require.resolve(absolutePath);
        console.log('绝对路径解析结果:', path.basename(resolved2));
        
        // 测试扩展名自动添加
        console.log('测试扩展名自动添加:');
        const resolved3 = require.resolve('./examples/basic-module.js');
        console.log('带扩展名解析结果:', path.basename(resolved3));
        
        // 验证解析结果一致性
        console.log('解析结果是否一致:', resolved1 === resolved2 && resolved2 === resolved3);
        
    } catch (err) {
        console.error('❌ 路径解析测试失败:', err.message);
    }
    
    console.log('');
}

/**
 * 测试5: JSON 模块加载
 */
function testJSONModuleLoading() {
    console.log('=== 测试5: JSON 模块加载 ===');
    
    try {
        // 创建临时 JSON 文件
        const jsonPath = path.join(__dirname, 'test-data.json');
        const testData = {
            name: 'Node.js 模块测试',
            version: '1.0.0',
            features: ['CommonJS', 'ES6 Module', 'JSON'],
            config: {
                debug: true,
                timeout: 5000
            }
        };
        
        fs.writeFileSync(jsonPath, JSON.stringify(testData, null, 2));
        console.log('创建测试 JSON 文件:', path.basename(jsonPath));
        
        // 加载 JSON 模块
        const jsonModule = require('./test-data.json');
        console.log('JSON 模块加载成功');
        console.log('模块类型:', typeof jsonModule);
        console.log('模块内容:', jsonModule);
        
        // 验证数据完整性
        console.log('数据验证:');
        console.log('  名称:', jsonModule.name);
        console.log('  版本:', jsonModule.version);
        console.log('  特性数量:', jsonModule.features.length);
        console.log('  调试模式:', jsonModule.config.debug);
        
        // 清理临时文件
        fs.unlinkSync(jsonPath);
        console.log('清理临时文件完成');
        
    } catch (err) {
        console.error('❌ JSON 模块加载测试失败:', err.message);
    }
    
    console.log('');
}

/**
 * 测试6: 模块信息和元数据
 */
function testModuleMetadata() {
    console.log('=== 测试6: 模块信息和元数据 ===');
    
    try {
        // 当前模块信息
        console.log('当前模块信息:');
        console.log('  模块 ID:', module.id);
        console.log('  文件名:', path.basename(module.filename));
        console.log('  是否已加载:', module.loaded);
        console.log('  父模块:', module.parent ? path.basename(module.parent.filename) : 'null');
        console.log('  子模块数量:', module.children.length);
        
        // 加载一个模块并查看其信息
        const basicModule = require('./examples/basic-module');
        const moduleKey = Object.keys(require.cache).find(key => key.includes('basic-module'));
        
        if (moduleKey) {
            const moduleInfo = require.cache[moduleKey];
            console.log('基础模块信息:');
            console.log('  模块 ID:', moduleInfo.id);
            console.log('  文件名:', path.basename(moduleInfo.filename));
            console.log('  是否已加载:', moduleInfo.loaded);
            console.log('  父模块:', moduleInfo.parent ? path.basename(moduleInfo.parent.filename) : 'null');
            console.log('  导出类型:', typeof moduleInfo.exports);
        }
        
        // 模块路径信息
        console.log('模块路径信息:');
        console.log('  __dirname:', __dirname);
        console.log('  __filename:', __filename);
        console.log('  process.cwd():', process.cwd());
        
    } catch (err) {
        console.error('❌ 模块元数据测试失败:', err.message);
    }
    
    console.log('');
}

/**
 * 测试7: 性能测试
 */
function testPerformance() {
    console.log('=== 测试7: 性能测试 ===');
    
    try {
        const iterations = 1000;
        
        // 测试模块加载性能（缓存命中）
        console.log(`测试模块加载性能 (${iterations} 次):`);
        
        console.time('模块加载 (缓存命中)');
        for (let i = 0; i < iterations; i++) {
            require('./examples/basic-module');
        }
        console.timeEnd('模块加载 (缓存命中)');
        
        // 测试路径解析性能
        console.time('路径解析');
        for (let i = 0; i < iterations; i++) {
            require.resolve('./examples/basic-module');
        }
        console.timeEnd('路径解析');
        
        // 内存使用情况
        const memUsage = process.memoryUsage();
        console.log('内存使用情况:');
        console.log(`  RSS: ${Math.round(memUsage.rss / 1024 / 1024)} MB`);
        console.log(`  Heap Used: ${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`);
        console.log(`  Heap Total: ${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`);
        
    } catch (err) {
        console.error('❌ 性能测试失败:', err.message);
    }
    
    console.log('');
}

/**
 * 测试8: 错误处理
 */
function testErrorHandling() {
    console.log('=== 测试8: 错误处理 ===');
    
    // 测试模块不存在
    try {
        require('./non-existent-module');
    } catch (err) {
        console.log('✅ 正确捕获模块不存在错误:', err.code);
    }
    
    // 测试语法错误模块
    try {
        const syntaxErrorPath = path.join(__dirname, 'syntax-error.js');
        fs.writeFileSync(syntaxErrorPath, 'const invalid syntax here');
        
        require('./syntax-error');
    } catch (err) {
        console.log('✅ 正确捕获语法错误:', err.name);
        
        // 清理文件
        const syntaxErrorPath = path.join(__dirname, 'syntax-error.js');
        if (fs.existsSync(syntaxErrorPath)) {
            fs.unlinkSync(syntaxErrorPath);
        }
    }
    
    // 测试 JSON 解析错误
    try {
        const invalidJsonPath = path.join(__dirname, 'invalid.json');
        fs.writeFileSync(invalidJsonPath, '{ invalid json }');
        
        require('./invalid.json');
    } catch (err) {
        console.log('✅ 正确捕获 JSON 解析错误:', err.name);
        
        // 清理文件
        const invalidJsonPath = path.join(__dirname, 'invalid.json');
        if (fs.existsSync(invalidJsonPath)) {
            fs.unlinkSync(invalidJsonPath);
        }
    }
    
    console.log('');
}

/**
 * 运行所有测试
 */
function runAllTests() {
    console.log('🚀 开始运行 Node.js 模块加载机制测试\n');
    
    testBasicModuleLoading();
    testModuleCache();
    testCircularDependency();
    testPathResolution();
    testJSONModuleLoading();
    testModuleMetadata();
    testPerformance();
    testErrorHandling();
    
    console.log('✅ 所有测试完成！');
    
    // 显示最终缓存状态
    console.log('\n📊 最终缓存统计:');
    const cacheKeys = Object.keys(require.cache);
    console.log(`总缓存模块数: ${cacheKeys.length}`);
    
    const ourModules = cacheKeys.filter(key => 
        key.includes('basic-module') || 
        key.includes('circular-') || 
        key.includes('test-module-loading')
    );
    
    console.log('我们的测试模块:');
    ourModules.forEach(key => {
        console.log(`  - ${path.basename(key)}`);
    });
}

// 如果直接运行此文件，执行所有测试
if (require.main === module) {
    runAllTests();
}

module.exports = {
    testBasicModuleLoading,
    testModuleCache,
    testCircularDependency,
    testPathResolution,
    testJSONModuleLoading,
    testModuleMetadata,
    testPerformance,
    testErrorHandling,
    runAllTests
};