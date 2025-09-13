
# JSON 解析器实现

一个完整的 JSON 解析器实现，包含词法分析器(Lexer)和语法分析器(Parser)，支持所有标准 JSON 格式。

## 项目结构

```
28. 实现一个 JSON 解析器/
├── readme.md          # 项目说明文档
├── json-parser.js     # JSON解析器核心实现
├── test.js           # 完整测试套件
└── example.js        # 使用示例和演示
```

## 功能特性

### ✅ 完整的 JSON 支持
- **基本数据类型**: 字符串、数字、布尔值、null
- **复合数据类型**: 对象、数组
- **嵌套结构**: 支持任意深度的嵌套
- **数字格式**: 整数、浮点数、科学计数法、负数

### ✅ 字符串处理
- **转义字符**: `\"`, `\\`, `\/`, `\b`, `\f`, `\n`, `\r`, `\t`
- **Unicode转义**: `\uXXXX` 格式
- **特殊字符**: 完整支持 JSON 字符串规范

### ✅ 严格的语法验证
- **语法错误检测**: 未闭合的括号、引号等
- **格式验证**: 尾随逗号、无效数字格式等
- **关键字验证**: 严格的 true/false/null 检查
- **详细错误信息**: 精确的错误位置和描述

### ✅ 高性能实现
- **词法分析**: 高效的字符流处理
- **语法分析**: 递归下降解析器
- **内存优化**: 最小化对象创建和内存分配

## 核心架构

### 词法分析器 (Lexer)
负责将 JSON 字符串分解为 tokens：

```javascript
const TokenType = {
  LEFT_BRACE: 'LEFT_BRACE',        // {
  RIGHT_BRACE: 'RIGHT_BRACE',      // }
  LEFT_BRACKET: 'LEFT_BRACKET',    // [
  RIGHT_BRACKET: 'RIGHT_BRACKET',  // ]
  COMMA: 'COMMA',                  // ,
  COLON: 'COLON',                  // :
  STRING: 'STRING',                // "string"
  NUMBER: 'NUMBER',                // 123, 123.45
  BOOLEAN: 'BOOLEAN',              // true, false
  NULL: 'NULL',                    // null
  EOF: 'EOF'                       // 结束符
};
```

### 语法分析器 (Parser)
负责将 tokens 解析为 JavaScript 对象：

- **递归下降**: 使用递归下降算法解析嵌套结构
- **错误恢复**: 提供详细的错误信息和位置
- **类型安全**: 严格的类型检查和转换

## 使用方法

### 基本用法

```javascript
const { parseJSON } = require('./json-parser.js');

// 解析基本数据类型
console.log(parseJSON('"hello"'));     // "hello"
console.log(parseJSON('123'));          // 123
console.log(parseJSON('true'));         // true
console.log(parseJSON('null'));         // null

// 解析数组
console.log(parseJSON('[1, 2, 3]'));   // [1, 2, 3]

// 解析对象
console.log(parseJSON('{"name": "John", "age": 30}'));
// { name: "John", age: 30 }
```

### 错误处理

```javascript
try {
  const result = parseJSON('{"name": }');
} catch (error) {
  console.log(error.message); // "JSON Parse Error: Unexpected token: RIGHT_BRACE"
}
```

### 复杂结构

```javascript
const complexJSON = `{
  "users": [
    {"name": "Alice", "active": true},
    {"name": "Bob", "active": false}
  ],
  "count": 2
}`;

const result = parseJSON(complexJSON);
console.log(result.users[0].name); // "Alice"
```

## 运行测试

```bash
# 运行完整测试套件
node test.js

# 运行使用示例
node example.js

# 直接运行解析器（包含内置测试）
node json-parser.js
```

## 测试覆盖

测试套件包含 37 个测试用例，覆盖：

1. **基本数据类型测试** (4个)
2. **数组测试** (4个)
3. **对象测试** (4个)
4. **复杂结构测试** (3个)
5. **字符串转义测试** (2个)
6. **空白字符处理测试** (1个)
7. **错误处理测试** (7个)
8. **与原生JSON.parse对比测试** (11个)
9. **性能测试** (1个)

## 性能表现

在测试中，解析包含 1000 个对象的大型 JSON（约 126KB）：
- **自定义解析器**: ~9ms
- **原生 JSON.parse**: ~0ms

虽然性能不如原生实现，但对于学习和理解 JSON 解析原理非常有价值。

## 实现亮点

### 1. 完整的错误处理
```javascript
// 检测尾随逗号
parseJSON('[1, 2, 3,]'); // 抛出错误

// 检测无效数字格式
parseJSON('01'); // 抛出错误

// 检测未闭合结构
parseJSON('[1, 2, 3'); // 抛出错误
```

### 2. Unicode 支持
```javascript
parseJSON('"\\u4E2D\\u6587"'); // "中文"
```

### 3. 科学计数法
```javascript
parseJSON('1.23e-4');  // 0.000123
parseJSON('1.23E10');  // 12300000000
```

### 4. 模块化设计
- 词法分析器和语法分析器分离
- 清晰的接口和错误处理
- 支持 Node.js 和浏览器环境

## 学习价值

这个项目展示了：

1. **编译原理基础**: 词法分析和语法分析
2. **递归下降解析**: 处理嵌套结构的经典方法
3. **错误处理**: 如何提供有用的错误信息
4. **字符串处理**: Unicode 和转义字符的处理
5. **测试驱动开发**: 完整的测试套件设计

## 扩展可能

- **流式解析**: 支持大文件的流式处理
- **更好的错误恢复**: 尝试从错误中恢复并继续解析
- **源码映射**: 提供原始位置信息
- **格式化输出**: 美化 JSON 输出
- **注释支持**: 支持 JSON5 风格的注释

## 参考资料

* [半小时实现一个 JSON 解析器](https://zhuanlan.zhihu.com/p/28049617)
* [JSON 官方规范](https://www.json.org/)
* [RFC 7159 - JSON 数据交换格式](https://tools.ietf.org/html/rfc7159)
* [编译原理 - 递归下降解析](https://en.wikipedia.org/wiki/Recursive_descent_parser)