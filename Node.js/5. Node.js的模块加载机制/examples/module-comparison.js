/**
 * 模块系统对比示例
 * 对比 CommonJS、ES6 Module、AMD 等不同模块系统
 */

console.log('🔄 模块系统对比示例\n');

/**
 * 1. CommonJS 模块系统 (Node.js 默认)
 */
console.log('=== CommonJS 模块系统 ===');

// CommonJS 导出方式
const commonjsModule = {
    // 方式1: module.exports
    exportWithModuleExports: function() {
        return {
            name: 'CommonJS Module',
            type: 'module.exports',
            features: ['同步加载', '运行时解析', '动态导入']
        };
    },
    
    // 方式2: exports 简写
    exportWithExports: function() {
        const exports = {};
        exports.name = 'CommonJS Exports';
        exports.getValue = () => 'CommonJS Value';
        return exports;
    },
    
    // 动态导入示例
    dynamicRequire: function(moduleName) {
        try {
            return require(moduleName);
        } catch (err) {
            console.log(`无法加载模块: ${moduleName}`);
            return null;
        }
    }
};

// 演示 CommonJS 特性
console.log('CommonJS 特性演示:');
console.log('1. 同步加载:', typeof require === 'function');
console.log('2. 运行时解析: 可以在条件语句中使用 require');
console.log('3. 模块对象:', typeof module === 'object');
console.log('4. 导出对象:', typeof module.exports === 'object');
console.log('5. 文件信息:', __filename ? '有 __filename' : '无 __filename');
console.log('6. 目录信息:', __dirname ? '有 __dirname' : '无 __dirname');

// 条件加载示例
if (process.env.NODE_ENV === 'development') {
    // 只在开发环境加载
    try {
        const devModule = require('./basic-module');
        console.log('7. 条件加载: 成功加载开发模块');
    } catch (err) {
        console.log('7. 条件加载: 开发模块不存在');
    }
}

console.log('');

/**
 * 2. ES6 模块系统对比
 */
console.log('=== ES6 模块系统对比 ===');

const es6Features = {
    // ES6 模块特性
    features: [
        '静态分析',
        '编译时解析',
        '树摇优化',
        '异步加载',
        '严格模式',
        '顶层 await'
    ],
    
    // 导入导出语法对比
    syntaxComparison: {
        commonjs: {
            import: 'const module = require("module")',
            export: 'module.exports = value',
            namedExport: 'exports.name = value',
            dynamicImport: 'require(variable)'
        },
        es6: {
            import: 'import module from "module"',
            namedImport: 'import { name } from "module"',
            export: 'export default value',
            namedExport: 'export const name = value',
            dynamicImport: 'import(variable)'
        }
    },
    
    // 互操作性
    interoperability: {
        commonjsInEs6: 'import cjs from "./commonjs-module"',
        es6InCommonjs: 'const es6 = await import("./es6-module.mjs")'
    }
};

console.log('ES6 模块特性:');
es6Features.features.forEach((feature, index) => {
    console.log(`${index + 1}. ${feature}`);
});

console.log('\n语法对比:');
console.log('CommonJS 导入:', es6Features.syntaxComparison.commonjs.import);
console.log('ES6 导入:    ', es6Features.syntaxComparison.es6.import);
console.log('CommonJS 导出:', es6Features.syntaxComparison.commonjs.export);
console.log('ES6 导出:    ', es6Features.syntaxComparison.es6.export);

console.log('');

/**
 * 3. AMD (Asynchronous Module Definition) 模拟
 */
console.log('=== AMD 模块系统模拟 ===');

// 简单的 AMD 实现
function define(dependencies, factory) {
    // 模拟 AMD 的 define 函数
    console.log('定义 AMD 模块，依赖:', dependencies);
    
    // 模拟依赖解析
    const resolvedDeps = dependencies.map(dep => {
        if (dep === 'require') return require;
        if (dep === 'exports') return {};
        if (dep === 'module') return module;
        return {}; // 简化处理
    });
    
    return factory.apply(null, resolvedDeps);
}

// AMD 模块示例
const amdModule = define(['require', 'exports'], function(require, exports) {
    console.log('AMD 模块工厂函数执行');
    
    exports.name = 'AMD Module';
    exports.features = ['异步加载', '依赖注入', '浏览器友好'];
    exports.load = function(callback) {
        setTimeout(() => {
            callback('AMD 模块加载完成');
        }, 10);
    };
    
    return exports;
});

console.log('AMD 模块创建:', amdModule.name);
console.log('');

/**
 * 4. UMD (Universal Module Definition) 模拟
 */
console.log('=== UMD 模块系统模拟 ===');

// UMD 模式
(function (root, factory) {
    console.log('UMD 模块包装器执行');
    
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        // CommonJS
        console.log('检测到 CommonJS 环境');
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        console.log('检测到 AMD 环境');
        define([], factory);
    } else {
        // 浏览器全局变量
        console.log('使用浏览器全局变量');
        root.UMDModule = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    console.log('UMD 模块工厂函数执行');
    
    return {
        name: 'UMD Module',
        features: ['通用兼容', '多环境支持', '向后兼容'],
        getEnvironment: function() {
            if (typeof module !== 'undefined' && module.exports) {
                return 'Node.js/CommonJS';
            } else if (typeof define === 'function' && define.amd) {
                return 'AMD';
            } else {
                return 'Browser Global';
            }
        }
    };
}));

console.log('');

/**
 * 5. 性能和特性对比
 */
console.log('=== 性能和特性对比 ===');

const performanceComparison = {
    commonjs: {
        loadTime: '同步，阻塞',
        bundleSize: '运行时解析，较大',
        treeShaking: '不支持',
        staticAnalysis: '不支持',
        browserSupport: '需要打包工具'
    },
    es6: {
        loadTime: '异步，非阻塞',
        bundleSize: '编译时优化，较小',
        treeShaking: '支持',
        staticAnalysis: '支持',
        browserSupport: '现代浏览器原生支持'
    },
    amd: {
        loadTime: '异步，非阻塞',
        bundleSize: '运行时解析，中等',
        treeShaking: '部分支持',
        staticAnalysis: '部分支持',
        browserSupport: '需要加载器'
    }
};

console.log('特性对比表:');
console.log('┌─────────────┬─────────────┬─────────────┬─────────────┐');
console.log('│    特性     │  CommonJS   │   ES6 Module│     AMD     │');
console.log('├─────────────┼─────────────┼─────────────┼─────────────┤');
console.log('│  加载方式   │    同步     │    异步     │    异步     │');
console.log('│  静态分析   │   不支持    │    支持     │  部分支持   │');
console.log('│  树摇优化   │   不支持    │    支持     │  部分支持   │');
console.log('│  浏览器支持 │  需要打包   │  原生支持   │  需要加载器 │');
console.log('└─────────────┴─────────────┴─────────────┴─────────────┘');

console.log('');

/**
 * 6. 实际使用建议
 */
console.log('=== 实际使用建议 ===');

const recommendations = {
    nodejs: {
        primary: 'CommonJS',
        reason: 'Node.js 默认支持，生态系统成熟',
        migration: '逐步迁移到 ES6 Module (.mjs 或 package.json type: "module")'
    },
    browser: {
        primary: 'ES6 Module',
        reason: '现代浏览器原生支持，性能更好',
        fallback: 'UMD 用于向后兼容'
    },
    library: {
        primary: 'UMD',
        reason: '最大兼容性，支持多种环境',
        modern: '同时提供 ES6 Module 版本'
    }
};

console.log('使用建议:');
console.log('1. Node.js 项目: 优先使用 CommonJS，新项目考虑 ES6 Module');
console.log('2. 浏览器项目: 使用 ES6 Module，配合构建工具');
console.log('3. 库开发: 提供 UMD 版本确保兼容性');
console.log('4. 现代项目: 全面拥抱 ES6 Module');

console.log('');

/**
 * 7. 迁移策略
 */
console.log('=== 迁移策略 ===');

const migrationStrategy = {
    step1: '评估现有代码库和依赖',
    step2: '选择合适的模块系统',
    step3: '配置构建工具和环境',
    step4: '逐步迁移核心模块',
    step5: '更新测试和文档',
    step6: '性能测试和优化'
};

console.log('迁移步骤:');
Object.entries(migrationStrategy).forEach(([step, description]) => {
    console.log(`${step}: ${description}`);
});

// 导出对比结果
module.exports = {
    commonjsModule,
    es6Features,
    amdModule,
    performanceComparison,
    recommendations,
    migrationStrategy
};