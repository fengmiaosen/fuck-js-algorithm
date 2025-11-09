# Jest 在 Node.js 中的使用介绍

Jest 是一个零配置、速度快、功能完善的 JavaScript 测试框架，常用于 Node.js 服务端与前端项目。它内置测试运行器、断言、模拟（mock）、快照、并行执行与覆盖率统计，开箱即用。

## 安装与初始化

```bash
# 纯 JavaScript 项目
npm i -D jest

# TypeScript 项目（推荐 ts-jest）
npm i -D jest ts-jest @types/jest
npx ts-jest config:init  # 生成基础 jest.config.js

# 如果使用 Babel（如需转换 ESM/最新语法）
npm i -D babel-jest @babel/preset-env
```

在 `package.json` 添加脚本：

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  }
}
```

## 基本用法

示例：被测模块与测试文件通常一一对应，测试文件以 `.test.js` 或 `.spec.js` 结尾。

```js
// sum.js
function sum(a, b) {
  return a + b;
}
module.exports = sum; // CommonJS 示例

// sum.test.js
const sum = require('./sum');

describe('sum', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
```

运行：`npm test`

## 断言与常用匹配器

- 值比较：`toBe`（===）、`toEqual`（深度相等）、`toBeNull`、`toBeUndefined`
- 数字与字符串：`toBeGreaterThan`、`toContain`
- 异常：`toThrow`
- Promise：`resolves` / `rejects`
- 对象/数组：`toMatchObject`、`arrayContaining`

```js
expect([1, 2, 3]).toContain(2);
expect({ a: 1, b: 2 }).toMatchObject({ a: 1 });
```

## 异步测试

优先使用 `async/await`，或直接断言 Promise：

```js
// async.test.js
async function getUser(id) {
  return { id, name: 'Alice' };
}

test('getUser returns user', async () => {
  const user = await getUser(1);
  expect(user).toHaveProperty('id', 1);
});

test('promise style', async () => {
  await expect(getUser(2)).resolves.toHaveProperty('id', 2);
});
```

## Mock 与 Spy（函数/模块模拟）

- 函数：`jest.fn()` 创建桩函数；`mockReturnValue`、`mockResolvedValue`
- 监视：`jest.spyOn(obj, 'method')`
- 模块：`jest.mock('module-name')`

```js
// service.js
const db = require('./db');
exports.getScore = async (userId) => db.fetchScore(userId);

// service.test.js
jest.mock('./db', () => ({ fetchScore: jest.fn() }));
const db = require('./db');
const { getScore } = require('./service');

test('returns score from db', async () => {
  db.fetchScore.mockResolvedValue(95);
  await expect(getScore('u1')).resolves.toBe(95);
});
```

## 定时器与时间

使用假定时器控制 `setTimeout`/`setInterval`：

```js
jest.useFakeTimers();

test('delays execution', () => {
  const fn = jest.fn();
  setTimeout(fn, 1000);

  jest.advanceTimersByTime(1000);
  expect(fn).toHaveBeenCalledTimes(1);
});
```

冻结系统时间：

```js
jest.useFakeTimers();
jest.setSystemTime(new Date('2024-01-01T00:00:00Z'));
```

## 配置文件（jest.config.js/ts）

常用配置示例：

```js
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  // TypeScript 项目使用 ts-jest
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  // JS/Babel 项目可使用 babel-jest
  // transform: { '^.+\\.[jt]sx?$': 'babel-jest' },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{js,ts}', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // 路径别名
  },
};
```

`jest.setup.js` 用于全局初始化（如扩展匹配器）：

```js
// jest.setup.js
// 示例：添加 jest-extended（需先安装）
// import 'jest-extended';
```

## 运行与调试

- 交互监听：`jest --watch`
- 指定用例：`jest path/to/file.test.js -t "case name"`
- 串行运行：`jest --runInBand`（排查并发相关问题）
- 控制并发：`jest --maxWorkers=50%`

在 IDE 里可直接为单测文件/用例设置断点；Jest 会在 Node 环境下执行，断点有效。

## 覆盖率

- 启用：`jest --coverage`
- 统计项：`statements`、`branches`、`functions`、`lines`
- 目录：默认输出到 `coverage/`，支持 HTML 报告

配置覆盖率阈值：

```js
// jest.config.js
module.exports = {
  // ...
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },
};
```

## TypeScript 支持

使用 `ts-jest` 最省心：

```js
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
```

测试文件可使用 `.test.ts`，并通过 `tsconfig.json` 配置路径别名与编译选项。

## ESM/CJS 注意事项

- 若 `package.json` 中设置 `"type": "module"`，请使用 `import/export`，并避免在测试中混用 `require`。
- 对于旧版本 Node/Jest 的 ESM 兼容，可考虑 `babel-jest` 转换或启用 `--experimental-vm-modules`（新版本通常不需要）。
- `jest.mock()` 在 ESM 下有语义差异；若遇到问题，可改用 `vi.mock`（Vitest）或以 `babel-jest`/`ts-jest` 提前转换解决。

## HTTP API 测试示例（配合 supertest）

```bash
npm i -D supertest express
```

```js
// app.js
const express = require('express');
const app = express();
app.get('/ping', (req, res) => res.json({ ok: true }));
module.exports = app;

// app.test.js
const request = require('supertest');
const app = require('./app');

test('GET /ping', async () => {
  const res = await request(app).get('/ping');
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ ok: true });
});
```

## 路径别名（moduleNameMapper）

```js
// jest.config.js
module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

在 `tsconfig.json` 中也应保持一致：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

## 最佳实践

- 测试环境设为 `node`，避免无意使用浏览器 `jsdom` 行为。
- 单测独立、原子化；通过 `describe` 分组，避免跨用例状态污染。
- 对外部依赖（数据库、网络、文件系统）使用 mock，保持测试稳定与快速。
- 覆盖率阈值合理设置，关注关键业务与核心模块的质量指标。
- CI 中使用 `jest --coverage --ci`，结合并发与缓存提升吞吐。

## 常见问题速查

- 找不到模块：检查 `moduleNameMapper` 与 `roots` 配置，或测试文件命名。
- ESM 报错：确保使用统一的导入风格，必要时用 `babel-jest`/`ts-jest` 转换。
- Mock 无效：确认 `jest.mock()` 调用在被测模块 `require/import` 之前。
- 并发相关 flaky：使用 `--runInBand` 串行运行定位问题；避免跨用例共享资源。

—— 以上覆盖了 Node.js 中使用 Jest 的核心流程与常见场景。按需将示例替换为你项目的实际模块与结构即可落地。