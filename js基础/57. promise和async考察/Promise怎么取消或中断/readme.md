# Promise 取消和中断机制

> 参考文章：https://juejin.im/post/5cc093635188252e754f2239

## 核心概念

Promise 本身是不可取消的，一旦创建就会执行到完成。但我们可以通过以下几种方式实现"取消"效果：

1. **AbortController** - 现代浏览器标准API
2. **Promise.race** - 竞态取消
3. **自定义取消Token** - 手动控制
4. **包装器模式** - 封装可取消的Promise

## 方法一：AbortController（推荐）

### 基本用法

```javascript
// 创建 AbortController
const controller = new AbortController();
const signal = controller.signal;

// 可取消的 fetch 请求
fetch('/api/data', { signal })
  .then(response => response.json())
  .then(data => console.log('数据:', data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('请求被取消');
    } else {
      console.error('请求失败:', error);
    }
  });

// 5秒后取消请求
setTimeout(() => {
  controller.abort();
}, 5000);
```

### 自定义可取消Promise

```javascript
function createCancelablePromise(executor) {
  const controller = new AbortController();
  const signal = controller.signal;
  
  const promise = new Promise((resolve, reject) => {
    // 监听取消信号
    signal.addEventListener('abort', () => {
      reject(new Error('Promise被取消'));
    });
    
    // 执行原始逻辑
    executor(resolve, reject, signal);
  });
  
  // 返回Promise和取消方法
  return {
    promise,
    cancel: () => controller.abort()
  };
}

// 使用示例
const { promise, cancel } = createCancelablePromise((resolve, reject, signal) => {
  const timer = setTimeout(() => {
    if (!signal.aborted) {
      resolve('任务完成');
    }
  }, 3000);
  
  // 清理定时器
  signal.addEventListener('abort', () => {
    clearTimeout(timer);
  });
});

promise
  .then(result => console.log(result))
  .catch(error => console.log('错误:', error.message));

// 1秒后取消
setTimeout(() => cancel(), 1000);
```

## 方法二：Promise.race 竞态取消

```javascript
function createRaceCancelablePromise(originalPromise) {
  let cancelReject;
  
  const cancelPromise = new Promise((_, reject) => {
    cancelReject = reject;
  });
  
  const racePromise = Promise.race([
    originalPromise,
    cancelPromise
  ]);
  
  return {
    promise: racePromise,
    cancel: () => cancelReject(new Error('Promise被取消'))
  };
}

// 使用示例
const originalPromise = new Promise(resolve => {
  setTimeout(() => resolve('原始任务完成'), 3000);
});

const { promise, cancel } = createRaceCancelablePromise(originalPromise);

promise
  .then(result => console.log(result))
  .catch(error => console.log('错误:', error.message));

// 1秒后取消
setTimeout(() => cancel(), 1000);
```

## 方法三：自定义取消Token

```javascript
class CancelToken {
  constructor() {
    this.isCancelled = false;
    this.reason = null;
    this.callbacks = [];
  }
  
  cancel(reason = '操作被取消') {
    if (this.isCancelled) return;
    
    this.isCancelled = true;
    this.reason = reason;
    
    // 执行所有取消回调
    this.callbacks.forEach(callback => callback(reason));
    this.callbacks = [];
  }
  
  onCancel(callback) {
    if (this.isCancelled) {
      callback(this.reason);
    } else {
      this.callbacks.push(callback);
    }
  }
  
  throwIfCancelled() {
    if (this.isCancelled) {
      throw new Error(this.reason);
    }
  }
}

function createTokenCancelablePromise(executor, cancelToken) {
  return new Promise((resolve, reject) => {
    // 如果已经取消，直接拒绝
    if (cancelToken.isCancelled) {
      reject(new Error(cancelToken.reason));
      return;
    }
    
    // 监听取消事件
    cancelToken.onCancel(reason => {
      reject(new Error(reason));
    });
    
    // 执行原始逻辑
    executor(resolve, reject, cancelToken);
  });
}

// 使用示例
const cancelToken = new CancelToken();

const promise = createTokenCancelablePromise((resolve, reject, token) => {
  const timer = setTimeout(() => {
    try {
      token.throwIfCancelled();
      resolve('任务完成');
    } catch (error) {
      reject(error);
    }
  }, 3000);
  
  token.onCancel(() => {
    clearTimeout(timer);
  });
}, cancelToken);

promise
  .then(result => console.log(result))
  .catch(error => console.log('错误:', error.message));

// 1秒后取消
setTimeout(() => {
  cancelToken.cancel('用户主动取消');
}, 1000);
```

## 方法四：包装器模式

```javascript
class CancelablePromise {
  constructor(executor) {
    this.isCancelled = false;
    this.cancelReason = null;
    
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      
      const wrappedResolve = (value) => {
        if (!this.isCancelled) {
          resolve(value);
        }
      };
      
      const wrappedReject = (reason) => {
        if (!this.isCancelled) {
          reject(reason);
        }
      };
      
      executor(wrappedResolve, wrappedReject);
    });
  }
  
  cancel(reason = 'Promise被取消') {
    if (this.isCancelled) return;
    
    this.isCancelled = true;
    this.cancelReason = reason;
    this.reject(new Error(reason));
  }
  
  then(onFulfilled, onRejected) {
    return this.promise.then(onFulfilled, onRejected);
  }
  
  catch(onRejected) {
    return this.promise.catch(onRejected);
  }
  
  finally(onFinally) {
    return this.promise.finally(onFinally);
  }
}

// 使用示例
const cancelablePromise = new CancelablePromise((resolve, reject) => {
  setTimeout(() => {
    resolve('任务完成');
  }, 3000);
});

cancelablePromise
  .then(result => console.log(result))
  .catch(error => console.log('错误:', error.message));

// 1秒后取消
setTimeout(() => {
  cancelablePromise.cancel('用户取消操作');
}, 1000);
```

## 实际应用场景

### 1. HTTP请求取消

```javascript
class HttpClient {
  constructor() {
    this.pendingRequests = new Map();
  }
  
  async request(url, options = {}) {
    const controller = new AbortController();
    const requestId = Date.now() + Math.random();
    
    // 保存请求引用
    this.pendingRequests.set(requestId, controller);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      this.pendingRequests.delete(requestId);
      return await response.json();
    } catch (error) {
      this.pendingRequests.delete(requestId);
      throw error;
    }
  }
  
  cancelAllRequests() {
    this.pendingRequests.forEach(controller => {
      controller.abort();
    });
    this.pendingRequests.clear();
  }
}

// 使用示例
const client = new HttpClient();

client.request('/api/data')
  .then(data => console.log('数据:', data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('请求被取消');
    }
  });

// 取消所有请求
setTimeout(() => {
  client.cancelAllRequests();
}, 1000);
```

### 2. 组件卸载时取消异步操作

```javascript
class Component {
  constructor() {
    this.abortController = new AbortController();
  }
  
  async loadData() {
    try {
      const data = await this.fetchData(this.abortController.signal);
      this.setState({ data });
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('加载数据失败:', error);
      }
    }
  }
  
  async fetchData(signal) {
    const response = await fetch('/api/data', { signal });
    return response.json();
  }
  
  unmount() {
    // 组件卸载时取消所有异步操作
    this.abortController.abort();
  }
}
```

### 3. 超时取消

```javascript
function withTimeout(promise, timeout) {
  const controller = new AbortController();
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      controller.abort();
      reject(new Error(`操作超时 (${timeout}ms)`));
    }, timeout);
  });
  
  return Promise.race([promise, timeoutPromise]);
}

// 使用示例
const slowPromise = new Promise(resolve => {
  setTimeout(() => resolve('慢操作完成'), 5000);
});

withTimeout(slowPromise, 2000)
  .then(result => console.log(result))
  .catch(error => console.log('错误:', error.message));
```

## 最佳实践

### 1. 优先使用 AbortController
- 现代浏览器标准API
- 与fetch等原生API集成良好
- 性能优秀，内存占用少

### 2. 正确处理取消状态
```javascript
// ✅ 正确：检查取消状态
if (signal.aborted) {
  throw new Error('操作被取消');
}

// ❌ 错误：忽略取消状态
// 继续执行可能导致内存泄漏
```

### 3. 清理资源
```javascript
signal.addEventListener('abort', () => {
  // 清理定时器
  clearTimeout(timer);
  // 清理事件监听器
  element.removeEventListener('click', handler);
  // 关闭连接
  websocket.close();
});
```

### 4. 错误处理
```javascript
.catch(error => {
  if (error.name === 'AbortError') {
    // 取消操作，通常不需要显示错误
    console.log('操作被取消');
  } else {
    // 真正的错误，需要处理
    console.error('操作失败:', error);
  }
});
```

## 实际代码示例

### 基础示例 (examples.js)

我们创建了一个完整的示例文件，演示了所有主要的Promise取消机制：

```bash
node examples.js
```

**执行结果：**
```
=== Promise 取消机制演示 ===

1. AbortController 基本用法:
AbortController: 1秒后取消操作
AbortController: 操作被取消

2. Promise.race 竞态取消:
Promise.race: 1秒后取消操作
Promise.race: 操作被取消

3. 自定义取消Token:
CancelToken: 1秒后取消操作
CancelToken: 用户主动取消

4. 包装器模式:
包装器模式: 1秒后取消操作
包装器模式: 用户取消操作

5. HTTP请求取消模拟:
取消 2 个待处理请求
请求1失败: 请求被取消
请求2失败: 请求被取消

6. 超时取消示例:
超时取消: 操作超时 (2000ms)
```

### 高级应用示例 (advanced-examples.js)

高级示例展示了Promise取消在实际项目中的应用：

1. **可取消的异步任务队列** - 管理多个异步任务的执行和取消
2. **并发请求管理器** - 控制并发请求数量和取消机制
3. **可取消的数据流处理** - 大数据批量处理的取消控制
4. **React Hook风格的可取消Promise** - 组件卸载时自动取消Promise

```bash
node advanced-examples.js
```

**关键执行结果：**
```
=== 并发请求管理器 ===
开始执行请求: /api/users
开始执行请求: /api/posts
请求 /api/comments 加入等待队列
...
当前状态: { active: 2, pending: 1, total: 3 }
取消活跃请求: /api/comments
✓ /api/users: 来自 /api/users 的数据
✗ /api/comments: 请求被取消

=== 可取消的数据流处理 ===
开始处理数据流...
处理批次 1: 5 项
  批次处理完成: 5 项
...
取消数据流处理...
数据流处理错误: 批次处理被取消
```

## 实际应用场景

### 1. 用户界面响应性
- 用户切换页面时取消未完成的请求
- 搜索框输入时取消之前的搜索请求
- 组件卸载时清理异步操作

### 2. 资源管理
- 控制并发请求数量
- 避免内存泄漏
- 优化网络资源使用

### 3. 用户体验优化
- 提供取消按钮让用户主动停止操作
- 超时机制防止长时间等待
- 错误恢复和重试机制

## 性能考虑

1. **内存泄漏防护** - 及时清理事件监听器和定时器
2. **并发控制** - 限制同时进行的异步操作数量
3. **资源释放** - 取消操作时释放相关资源
4. **错误处理** - 正确处理取消状态和错误状态

## 总结

| 方法 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| AbortController | 标准API，性能好 | 需要现代浏览器支持 | HTTP请求，现代应用 |
| Promise.race | 兼容性好，简单 | 原Promise仍会执行 | 简单超时控制 |
| 自定义Token | 灵活，可扩展 | 代码复杂 | 复杂业务逻辑 |
| 包装器模式 | 封装完整 | 性能开销 | 需要完整Promise接口 |

Promise 取消和中断机制是现代 JavaScript 异步编程中的重要概念。虽然 Promise 本身不支持取消，但通过以上几种方法可以实现类似的效果。

**推荐使用 AbortController**，它是现代JavaScript的标准做法，性能优秀且与原生API集成良好。通过本文的示例代码，你可以看到这些机制在实际项目中的应用，包括任务队列管理、并发控制、数据流处理等场景。掌握这些技术对于构建高性能、用户友好的 Web 应用程序至关重要。