JavaScript 模块化是将代码组织成独立的、可重用的模块的过程。模块化可以提高代码的可维护性、可读性和可重用性。以下是 JavaScript 中常见的模块化方式：

### 1. **立即执行函数表达式（IIFE）**

通过使用立即执行函数，您可以创建一个独立的作用域，避免全局命名冲突。

```javascript
(function () {
    // 私有变量和函数
    const privateVar = "I am private";

    function privateFunction() {
        console.log(privateVar);
    }

    // 暴露公共接口
    window.myModule = {
        publicMethod: function () {
            privateFunction();
        }
    };
})();
```

### 2. **CommonJS**

CommonJS 是 Node.js 中使用的模块化规范。模块通过 `require` 导入和 `module.exports` 导出。

```javascript
// math.js
const add = (a, b) => a + b;
module.exports = { add };

// app.js
const math = require('./math');
console.log(math.add(2, 3)); // 5
```

### 3. **AMD（异步模块定义）**

AMD 主要用于浏览器环境，支持异步加载模块。最常见的实现是 RequireJS。

```javascript
// math.js
define([], function () {
    return {
        add: function (a, b) {
            return a + b;
        }
    };
});

// app.js
require(['math'], function (math) {
    console.log(math.add(2, 3)); // 5
});
```

### 4. **ES6 模块（ESM）**

ES6 引入的模块化语法，支持 `import` 和 `export` 语句，具有静态分析能力，适合现代 JavaScript 开发。

```javascript
// math.js
export const add = (a, b) => a + b;

// app.js
import { add } from './math.js';
console.log(add(2, 3)); // 5
```

### 5. **UMD（通用模块定义）**

UMD 是一种设计用于兼容多种模块化规范的模式，既支持 CommonJS，也支持 AMD。

```javascript
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.myModule = factory();
    }
}(this, function () {
    const add = (a, b) => a + b;
    return { add };
}));
```

### 6. **TypeScript 模块**

TypeScript 支持 ES6 模块化，并提供类型检查和其他功能。使用方式与 ES6 模块相似。

```typescript
// math.ts
export const add = (a: number, b: number): number => a + b;

// app.ts
import { add } from './math';
console.log(add(2, 3)); // 5
```

### 7. **Webpack 和其他打包工具**

虽然 Webpack 和其他打包工具本身并不是模块化方案，但它们支持将各种模块化形式（如 CommonJS、AMD、ESM）编译为浏览器可用的格式。

### 总结

JavaScript 模块化的方式多种多样，每种方式都有其适用场景。选择合适的模块化方案可以提高代码的组织性和可维护性。对于现代开发，推荐使用 ES6 模块（ESM），因为它是标准化的，并得到了广泛支持。

## 参考

https://www.processon.com/view/link/5c8409bbe4b02b2ce492286a#map

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/export
