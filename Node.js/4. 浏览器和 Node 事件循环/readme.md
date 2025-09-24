
# JavaScript 事件循环：微任务与宏任务执行顺序详解

## 📋 核心概念

### 什么是事件循环（Event Loop）？

事件循环是JavaScript运行时的核心机制，负责协调执行栈、任务队列和微任务队列之间的工作。它确保JavaScript在单线程环境下能够处理异步操作。

### 执行栈（Call Stack）
- 存储当前正在执行的函数调用
- 遵循后进先出（LIFO）原则
- 同步代码直接在执行栈中执行

## 🎯 微任务 vs 宏任务

### 宏任务（Macro Tasks / Tasks）
宏任务是由宿主环境（浏览器或Node.js）提供的异步操作：

**浏览器环境：**
- `setTimeout` / `setInterval`
- `setImmediate`（IE/Edge）
- I/O 操作
- UI 渲染
- `MessageChannel`
- `postMessage`

**Node.js环境：**
- `setTimeout` / `setInterval`
- `setImmediate`
- I/O 操作
- `fs` 文件操作

### 微任务（Micro Tasks）
微任务是由JavaScript引擎提供的异步操作：

**通用：**
- `Promise.then/catch/finally`
- `async/await`
- `queueMicrotask()`
- `MutationObserver`（浏览器）
- `process.nextTick`（Node.js，优先级最高）

## ⚡ 执行顺序规则

### 基本执行顺序

```
1. 执行同步代码（执行栈）
2. 执行所有微任务（清空微任务队列）
3. 执行一个宏任务
4. 重复步骤2-3
```

### 详细执行流程

```javascript
// 执行顺序示例
console.log('1'); // 同步代码

setTimeout(() => {
    console.log('2'); // 宏任务
}, 0);

Promise.resolve().then(() => {
    console.log('3'); // 微任务
});

console.log('4'); // 同步代码

// 输出顺序：1 → 4 → 3 → 2
```

**执行分析：**
1. 执行同步代码：输出 `1`
2. `setTimeout` 加入宏任务队列
3. `Promise.then` 加入微任务队列
4. 执行同步代码：输出 `4`
5. 执行栈清空，执行所有微任务：输出 `3`
6. 执行一个宏任务：输出 `2`

## 🔄 事件循环完整流程

```
┌───────────────────────────┐
┌─>│           timer           │  ← setTimeout, setInterval
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │  ← I/O callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │  ← 内部使用
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │  ← 获取新的I/O事件
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │  ← setImmediate
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │  ← socket.on('close', ...)
   └───────────────────────────┘
```

## 🌐 浏览器 vs Node.js 差异

### 历史差异（Node.js < 11.0）

**浏览器：** 每执行一个宏任务后，立即清空所有微任务
**Node.js：** 在每个阶段结束后才清空微任务队列

### 现状（Node.js ≥ 11.0）

Node.js 11.0+ 已经与浏览器行为保持一致：
- 每执行一个宏任务后立即清空微任务队列
- 执行顺序完全相同

### Node.js 特殊情况

```javascript
// process.nextTick 优先级最高
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('Promise'));
setTimeout(() => console.log('setTimeout'), 0);

// 输出：nextTick → Promise → setTimeout
```

**Node.js 微任务优先级：**
1. `process.nextTick`（最高优先级）
2. `Promise.then/catch/finally`
3. `queueMicrotask`

## 💡 实际应用场景

### 1. 确保DOM更新后执行

```javascript
// 错误方式
element.style.display = 'block';
console.log(element.offsetHeight); // 可能获取不到正确高度

// 正确方式
element.style.display = 'block';
Promise.resolve().then(() => {
    console.log(element.offsetHeight); // 确保DOM更新后执行
});
```

### 2. 批量处理操作

```javascript
function batchUpdate(items) {
    items.forEach(item => {
        // 同步处理
        processItem(item);
    });
    
    // 微任务中执行后续操作
    Promise.resolve().then(() => {
        updateUI();
        notifyComplete();
    });
}
```

### 3. 避免阻塞UI

```javascript
function heavyTask(data) {
    const chunks = chunkArray(data, 1000);
    
    function processChunk(index) {
        if (index >= chunks.length) return;
        
        // 处理当前块
        processData(chunks[index]);
        
        // 使用宏任务避免阻塞UI
        setTimeout(() => processChunk(index + 1), 0);
    }
    
    processChunk(0);
}
```

## 🎯 面试常考题目

### 题目1：基础执行顺序

```javascript
console.log('start');

setTimeout(() => {
    console.log('timeout1');
    Promise.resolve().then(() => {
        console.log('promise1');
    });
}, 0);

Promise.resolve().then(() => {
    console.log('promise2');
    setTimeout(() => {
        console.log('timeout2');
    }, 0);
});

console.log('end');

// 输出顺序：start → end → promise2 → timeout1 → promise1 → timeout2
```

### 题目2：复杂嵌套

```javascript
async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}

async function async2() {
    console.log('async2');
}

console.log('script start');

setTimeout(() => {
    console.log('setTimeout');
}, 0);

async1();

new Promise(resolve => {
    console.log('promise1');
    resolve();
}).then(() => {
    console.log('promise2');
});

console.log('script end');

// 输出顺序：
// script start → async1 start → async2 → promise1 → script end 
// → async1 end → promise2 → setTimeout
```

### 题目3：Node.js特殊情况

```javascript
// Node.js环境
setImmediate(() => console.log('setImmediate'));
setTimeout(() => console.log('setTimeout'), 0);
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('Promise'));

// 输出顺序：nextTick → Promise → setTimeout → setImmediate
// 注意：setTimeout和setImmediate的顺序可能因系统而异
```

## 🔧 调试技巧

### 1. 使用性能工具

```javascript
// 标记微任务和宏任务
function markMicroTask(name) {
    Promise.resolve().then(() => {
        console.log(`MicroTask: ${name}`);
    });
}

function markMacroTask(name) {
    setTimeout(() => {
        console.log(`MacroTask: ${name}`);
    }, 0);
}
```

### 2. 可视化事件循环

```javascript
function visualizeEventLoop() {
    console.log('=== Event Loop Visualization ===');
    
    console.log('1. Sync code');
    
    setTimeout(() => {
        console.log('4. Macro task 1');
    }, 0);
    
    Promise.resolve().then(() => {
        console.log('3. Micro task 1');
        return Promise.resolve();
    }).then(() => {
        console.log('5. Micro task 2');
    });
    
    setTimeout(() => {
        console.log('6. Macro task 2');
    }, 0);
    
    console.log('2. Sync code end');
}
```

## 📚 最佳实践

### 1. 合理使用微任务

```javascript
// ✅ 好的做法：用于状态更新后的回调
function updateState(newState) {
    this.state = newState;
    
    // 确保状态更新后执行
    Promise.resolve().then(() => {
        this.onStateChange();
    });
}

// ❌ 避免：过度使用微任务
function badExample() {
    for (let i = 0; i < 1000; i++) {
        Promise.resolve().then(() => {
            // 大量微任务会阻塞宏任务
            heavyComputation();
        });
    }
}
```

### 2. 性能优化

```javascript
// ✅ 批量DOM操作
function batchDOMUpdates(elements, updates) {
    // 同步执行所有DOM操作
    elements.forEach((el, index) => {
        el.style.transform = updates[index];
    });
    
    // 微任务中执行后续操作
    Promise.resolve().then(() => {
        triggerAnimations();
    });
}

// ✅ 分片处理大量数据
function processLargeDataset(data) {
    const chunkSize = 1000;
    let index = 0;
    
    function processChunk() {
        const chunk = data.slice(index, index + chunkSize);
        
        // 处理当前块
        chunk.forEach(processItem);
        
        index += chunkSize;
        
        if (index < data.length) {
            // 使用宏任务避免阻塞
            setTimeout(processChunk, 0);
        }
    }
    
    processChunk();
}
```

## 🔗 参考资料

* [浏览器和Node 事件循环的区别](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/26)
* [MDN - Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)
* [Node.js Event Loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
* [HTML Living Standard - Event Loop](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop)

## 💡 总结

**关键要点：**
1. **执行顺序**：同步代码 → 微任务 → 宏任务
2. **微任务优先级**：总是在下一个宏任务之前执行
3. **Node.js特殊性**：`process.nextTick` 优先级最高
4. **版本差异**：Node.js 11.0+ 与浏览器行为一致
5. **性能考虑**：合理使用微任务和宏任务避免阻塞

理解事件循环是掌握JavaScript异步编程的关键，它直接影响代码的执行顺序和性能表现。
