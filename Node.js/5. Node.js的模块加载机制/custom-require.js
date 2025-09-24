/**
 * 手写实现简版 require 函数
 * 模拟 Node.js 的模块加载机制
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('🛠️ 自定义 require 函数实现\n');

/**
 * 简版 Module 类
 */
class CustomModule {
    constructor(id, parent) {
        this.id = id;
        this.filename = id;
        this.loaded = false;
        this.parent = parent;
        this.children = [];
        this.exports = {};
        this.paths = CustomModule._nodeModulePaths(path.dirname(id));
    }
    
    /**
     * 生成 node_modules 搜索路径
     */
    static _nodeModulePaths(from) {
        const paths = [];
        let current = from;
        
        while (current !== path.dirname(current)) {
            paths.push(path.join(current, 'node_modules'));
            current = path.dirname(current);
        }
        
        return paths;
    }
    
    /**
     * 解析模块路径
     */
    static _resolveFilename(request, parent) {
        // 1. 核心模块检查（简化版）
        const coreModules = ['fs', 'path', 'http', 'url', 'util', 'events'];
        if (coreModules.includes(request)) {
            throw new Error(`核心模块 "${request}" 无法在自定义require中加载`);
        }
        
        // 2. 相对路径或绝对路径
        if (request.startsWith('./') || request.startsWith('../') || path.isAbsolute(request)) {
            const basePath = parent ? path.dirname(parent.filename) : process.cwd();
            return CustomModule._resolveFile(path.resolve(basePath, request));
        }
        
        // 3. node_modules 查找
        const paths = parent ? parent.paths : CustomModule._nodeModulePaths(process.cwd());
        for (const modulePath of paths) {
            try {
                const fullPath = path.join(modulePath, request);
                return CustomModule._resolveFile(fullPath);
            } catch (err) {
                continue;
            }
        }
        
        throw new Error(`Cannot find module '${request}'`);
    }
    
    /**
     * 解析文件路径（添加扩展名）
     */
    static _resolveFile(filepath) {
        const extensions = ['.js', '.json', '.node'];
        
        // 1. 直接文件路径
        if (fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
            return filepath;
        }
        
        // 2. 添加扩展名尝试
        for (const ext of extensions) {
            const fullPath = filepath + ext;
            if (fs.existsSync(fullPath)) {
                return fullPath;
            }
        }
        
        // 3. 目录 + package.json
        if (fs.existsSync(filepath) && fs.statSync(filepath).isDirectory()) {
            const packagePath = path.join(filepath, 'package.json');
            if (fs.existsSync(packagePath)) {
                try {
                    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
                    if (pkg.main) {
                        return CustomModule._resolveFile(path.join(filepath, pkg.main));
                    }
                } catch (err) {
                    // 忽略 package.json 解析错误
                }
            }
            
            // 4. 目录 + index 文件
            for (const ext of extensions) {
                const indexPath = path.join(filepath, 'index' + ext);
                if (fs.existsSync(indexPath)) {
                    return indexPath;
                }
            }
        }
        
        throw new Error(`Cannot resolve file: ${filepath}`);
    }
    
    /**
     * 加载模块
     */
    load(filename) {
        this.filename = filename;
        const ext = path.extname(filename);
        
        // 根据扩展名选择加载器
        const loader = CustomModule._extensions[ext] || CustomModule._extensions['.js'];
        loader(this, filename);
        
        this.loaded = true;
    }
    
    /**
     * require 方法
     */
    require(id) {
        return customRequire(id, this);
    }
}

/**
 * 模块缓存
 */
CustomModule._cache = {};

/**
 * 文件扩展名加载器
 */
CustomModule._extensions = {
    '.js': function(module, filename) {
        const content = fs.readFileSync(filename, 'utf8');
        module._compile(content, filename);
    },
    
    '.json': function(module, filename) {
        const content = fs.readFileSync(filename, 'utf8');
        try {
            module.exports = JSON.parse(content);
        } catch (err) {
            err.message = `${filename}: ${err.message}`;
            throw err;
        }
    }
};

/**
 * 编译 JavaScript 代码
 */
CustomModule.prototype._compile = function(content, filename) {
    // 包装代码
    const wrapper = `(function(exports, require, module, __filename, __dirname) {\n${content}\n});`;
    
    // 编译代码
    const compiledWrapper = vm.runInThisContext(wrapper, {
        filename: filename,
        lineOffset: 0,
        displayErrors: true
    });
    
    // 准备参数
    const dirname = path.dirname(filename);
    const require = (id) => this.require(id);
    
    // 执行代码
    const result = compiledWrapper.call(
        this.exports,    // this
        this.exports,    // exports
        require,         // require
        this,           // module
        filename,       // __filename
        dirname         // __dirname
    );
    
    return result;
};

/**
 * 自定义 require 函数
 */
function customRequire(id, parent) {
    console.log(`🔍 CustomRequire: 加载模块 "${id}"`);
    
    // 1. 解析文件路径
    const filename = CustomModule._resolveFilename(id, parent);
    console.log(`📁 解析路径: ${filename}`);
    
    // 2. 检查缓存
    if (CustomModule._cache[filename]) {
        console.log(`💾 从缓存获取: ${filename}`);
        return CustomModule._cache[filename].exports;
    }
    
    // 3. 创建模块对象
    const module = new CustomModule(filename, parent);
    
    // 4. 缓存模块（在加载前缓存，防止循环依赖）
    CustomModule._cache[filename] = module;
    
    // 5. 建立父子关系
    if (parent && parent.children) {
        parent.children.push(module);
    }
    
    try {
        // 6. 加载模块
        console.log(`⚙️ 编译执行: ${filename}`);
        module.load(filename);
        console.log(`✅ 加载完成: ${filename}`);
        
        return module.exports;
    } catch (err) {
        // 加载失败时删除缓存
        delete CustomModule._cache[filename];
        throw err;
    }
}

/**
 * 添加工具方法
 */
customRequire.cache = CustomModule._cache;
customRequire.resolve = function(id, parent) {
    return CustomModule._resolveFilename(id, parent);
};

/**
 * 测试自定义 require
 */
function testCustomRequire() {
    console.log('=== 测试自定义 require 函数 ===\n');
    
    try {
        // 测试1: 加载 JSON 文件
        console.log('📋 测试1: 加载 JSON 文件');
        const packageJson = customRequire('./package.json');
        console.log('Package name:', packageJson.name || 'N/A');
        console.log('');
        
        // 测试2: 加载 JavaScript 模块
        console.log('📋 测试2: 加载 JavaScript 模块');
        const basicModule = customRequire('./examples/basic-module');
        console.log('模块类型:', typeof basicModule);
        console.log('模块方法:', Object.keys(basicModule));
        
        // 测试模块功能
        if (basicModule.increment) {
            basicModule.increment();
            console.log('计数器值:', basicModule.getCounter());
        }
        console.log('');
        
        // 测试3: 缓存机制
        console.log('📋 测试3: 缓存机制');
        const basicModule2 = customRequire('./examples/basic-module');
        console.log('两次加载是否相同:', basicModule === basicModule2);
        console.log('');
        
        // 测试4: 查看缓存
        console.log('📋 测试4: 查看缓存');
        console.log('缓存的模块数量:', Object.keys(customRequire.cache).length);
        Object.keys(customRequire.cache).forEach(key => {
            console.log(`  - ${path.basename(key)}`);
        });
        
    } catch (err) {
        console.error('❌ 测试失败:', err.message);
    }
}

/**
 * 性能对比测试
 */
function performanceComparison() {
    console.log('\n=== 性能对比测试 ===\n');
    
    const iterations = 100;
    
    // 原生 require 性能
    console.time('原生 require');
    for (let i = 0; i < iterations; i++) {
        require('./examples/basic-module');
    }
    console.timeEnd('原生 require');
    
    // 自定义 require 性能
    console.time('自定义 require');
    for (let i = 0; i < iterations; i++) {
        customRequire('./examples/basic-module');
    }
    console.timeEnd('自定义 require');
}

/**
 * 功能对比
 */
function featureComparison() {
    console.log('\n=== 功能对比 ===\n');
    
    console.log('✅ 已实现的功能:');
    console.log('  - 路径解析 (相对路径、绝对路径)');
    console.log('  - 文件扩展名自动添加');
    console.log('  - 模块缓存机制');
    console.log('  - JavaScript 和 JSON 文件加载');
    console.log('  - 模块包装和编译');
    console.log('  - 循环依赖处理');
    console.log('  - package.json main 字段支持');
    
    console.log('\n❌ 未实现的功能:');
    console.log('  - 核心模块加载');
    console.log('  - node_modules 完整查找算法');
    console.log('  - .node 文件支持');
    console.log('  - 条件导出 (exports 字段)');
    console.log('  - ESM 互操作');
    console.log('  - 源码映射支持');
}

// 运行测试
if (require.main === module) {
    testCustomRequire();
    performanceComparison();
    featureComparison();
}

// 导出自定义 require
module.exports = {
    customRequire,
    CustomModule,
    testCustomRequire,
    performanceComparison,
    featureComparison
};