// Promise 取消机制高级应用示例

console.log('=== Promise 取消机制高级应用 ===\n');

// 1. 可取消的异步任务队列
class CancelableTaskQueue {
  constructor() {
    this.tasks = [];
    this.isRunning = false;
    this.currentController = null;
  }
  
  addTask(taskFn, name) {
    this.tasks.push({ taskFn, name });
    console.log(`任务 "${name}" 已添加到队列`);
  }
  
  async start() {
    if (this.isRunning) {
      console.log('任务队列已在运行中');
      return;
    }
    
    this.isRunning = true;
    console.log('开始执行任务队列...');
    
    while (this.tasks.length > 0 && this.isRunning) {
      const task = this.tasks.shift();
      this.currentController = new AbortController();
      
      try {
        console.log(`执行任务: ${task.name}`);
        const result = await task.taskFn(this.currentController.signal);
        console.log(`任务 "${task.name}" 完成:`, result);
      } catch (error) {
        if (error.name === 'AbortError' || error.message.includes('取消')) {
          console.log(`任务 "${task.name}" 被取消`);
          break;
        } else {
          console.log(`任务 "${task.name}" 失败:`, error.message);
        }
      }
    }
    
    this.isRunning = false;
    this.currentController = null;
    console.log('任务队列执行结束\n');
  }
  
  cancel() {
    if (!this.isRunning) {
      console.log('没有正在运行的任务');
      return;
    }
    
    console.log('取消任务队列...');
    this.isRunning = false;
    
    if (this.currentController) {
      this.currentController.abort();
    }
    
    this.tasks = [];
  }
}

// 创建可取消的任务
function createCancelableTask(name, duration) {
  return (signal) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (!signal.aborted) {
          resolve(`${name} 执行完成`);
        }
      }, duration);
      
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new Error(`${name} 被取消`));
      });
    });
  };
}

// 演示任务队列
const taskQueue = new CancelableTaskQueue();
taskQueue.addTask(createCancelableTask('数据处理', 1000), '数据处理');
taskQueue.addTask(createCancelableTask('文件上传', 1500), '文件上传');
taskQueue.addTask(createCancelableTask('邮件发送', 800), '邮件发送');

taskQueue.start();

// 2秒后取消队列
setTimeout(() => {
  taskQueue.cancel();
}, 2000);

// 2. 可取消的并发请求管理器
setTimeout(() => {
  console.log('\n=== 并发请求管理器 ===');
  
  class ConcurrentRequestManager {
    constructor(maxConcurrency = 3) {
      this.maxConcurrency = maxConcurrency;
      this.activeRequests = new Map();
      this.pendingRequests = [];
    }
    
    async request(url, options = {}) {
      return new Promise((resolve, reject) => {
        const requestInfo = {
          url,
          options,
          resolve,
          reject,
          controller: new AbortController(),
          id: Date.now() + Math.random()
        };
        
        if (this.activeRequests.size < this.maxConcurrency) {
          this.executeRequest(requestInfo);
        } else {
          this.pendingRequests.push(requestInfo);
          console.log(`请求 ${url} 加入等待队列`);
        }
      });
    }
    
    async executeRequest(requestInfo) {
      const { url, controller, resolve, reject, id } = requestInfo;
      
      this.activeRequests.set(id, requestInfo);
      console.log(`开始执行请求: ${url}`);
      
      try {
        // 模拟HTTP请求
        const response = await new Promise((res, rej) => {
          const timer = setTimeout(() => {
            if (!controller.signal.aborted) {
              res({ data: `来自 ${url} 的数据`, status: 200 });
            }
          }, Math.random() * 2000 + 500);
          
          controller.signal.addEventListener('abort', () => {
            clearTimeout(timer);
            rej(new Error('请求被取消'));
          });
        });
        
        resolve(response);
        console.log(`请求完成: ${url}`);
      } catch (error) {
        reject(error);
        console.log(`请求失败: ${url} - ${error.message}`);
      } finally {
        this.activeRequests.delete(id);
        this.processNextRequest();
      }
    }
    
    processNextRequest() {
      if (this.pendingRequests.length > 0 && this.activeRequests.size < this.maxConcurrency) {
        const nextRequest = this.pendingRequests.shift();
        this.executeRequest(nextRequest);
      }
    }
    
    cancelRequest(url) {
      // 取消活跃请求
      for (const [id, requestInfo] of this.activeRequests) {
        if (requestInfo.url === url) {
          requestInfo.controller.abort();
          console.log(`取消活跃请求: ${url}`);
          return true;
        }
      }
      
      // 取消等待中的请求
      const index = this.pendingRequests.findIndex(req => req.url === url);
      if (index !== -1) {
        const requestInfo = this.pendingRequests.splice(index, 1)[0];
        requestInfo.reject(new Error('请求被取消'));
        console.log(`取消等待请求: ${url}`);
        return true;
      }
      
      return false;
    }
    
    cancelAllRequests() {
      console.log('取消所有请求...');
      
      // 取消活跃请求
      this.activeRequests.forEach(requestInfo => {
        requestInfo.controller.abort();
      });
      
      // 取消等待请求
      this.pendingRequests.forEach(requestInfo => {
        requestInfo.reject(new Error('请求被取消'));
      });
      
      this.activeRequests.clear();
      this.pendingRequests = [];
    }
    
    getStatus() {
      return {
        active: this.activeRequests.size,
        pending: this.pendingRequests.length,
        total: this.activeRequests.size + this.pendingRequests.length
      };
    }
  }
  
  const requestManager = new ConcurrentRequestManager(2);
  
  // 发起多个请求
  const urls = [
    '/api/users',
    '/api/posts',
    '/api/comments',
    '/api/categories',
    '/api/tags'
  ];
  
  urls.forEach(url => {
    requestManager.request(url)
      .then(response => console.log(`✓ ${url}:`, response.data))
      .catch(error => console.log(`✗ ${url}:`, error.message));
  });
  
  // 2秒后取消特定请求
  setTimeout(() => {
    console.log('\n当前状态:', requestManager.getStatus());
    requestManager.cancelRequest('/api/comments');
  }, 2000);
  
  // 4秒后取消所有请求
  setTimeout(() => {
    console.log('\n当前状态:', requestManager.getStatus());
    requestManager.cancelAllRequests();
  }, 4000);
}, 4000);

// 3. 可取消的数据流处理
setTimeout(() => {
  console.log('\n=== 可取消的数据流处理 ===');
  
  class CancelableDataStream {
    constructor() {
      this.isProcessing = false;
      this.controller = null;
    }
    
    async processStream(dataSource, processor, options = {}) {
      if (this.isProcessing) {
        throw new Error('数据流正在处理中');
      }
      
      this.isProcessing = true;
      this.controller = new AbortController();
      
      const { batchSize = 10, delay = 100 } = options;
      
      try {
        console.log('开始处理数据流...');
        
        for (let i = 0; i < dataSource.length; i += batchSize) {
          // 检查是否被取消
          if (this.controller.signal.aborted) {
            throw new Error('数据流处理被取消');
          }
          
          const batch = dataSource.slice(i, i + batchSize);
          console.log(`处理批次 ${Math.floor(i / batchSize) + 1}: ${batch.length} 项`);
          
          // 处理当前批次
          await processor(batch, this.controller.signal);
          
          // 批次间延迟
          if (delay > 0 && i + batchSize < dataSource.length) {
            await new Promise(resolve => {
              const timer = setTimeout(resolve, delay);
              this.controller.signal.addEventListener('abort', () => {
                clearTimeout(timer);
                resolve();
              });
            });
          }
        }
        
        console.log('数据流处理完成');
      } catch (error) {
        console.log('数据流处理错误:', error.message);
        throw error;
      } finally {
        this.isProcessing = false;
        this.controller = null;
      }
    }
    
    cancel() {
      if (!this.isProcessing) {
        console.log('没有正在处理的数据流');
        return;
      }
      
      console.log('取消数据流处理...');
      if (this.controller) {
        this.controller.abort();
      }
    }
  }
  
  // 模拟数据源
  const dataSource = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, value: Math.random() }));
  
  // 数据处理器
  async function dataProcessor(batch, signal) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (!signal.aborted) {
          // 模拟处理
          const processed = batch.map(item => ({ ...item, processed: true }));
          console.log(`  批次处理完成: ${processed.length} 项`);
          resolve(processed);
        }
      }, 200);
      
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new Error('批次处理被取消'));
      });
    });
  }
  
  const dataStream = new CancelableDataStream();
  
  dataStream.processStream(dataSource, dataProcessor, { batchSize: 5, delay: 150 })
    .then(() => console.log('所有数据处理完成'))
    .catch(error => console.log('数据处理失败:', error.message));
  
  // 3秒后取消处理
  setTimeout(() => {
    dataStream.cancel();
  }, 3000);
}, 8000);

// 4. React Hook 风格的可取消Promise
setTimeout(() => {
  console.log('\n=== React Hook 风格的可取消Promise ===');
  
  function useCancelablePromise() {
    const cancelablePromises = new Set();
    
    function makeCancelable(promise) {
      let isCanceled = false;
      
      const wrappedPromise = new Promise((resolve, reject) => {
        promise
          .then(value => {
            if (!isCanceled) {
              resolve(value);
            }
          })
          .catch(error => {
            if (!isCanceled) {
              reject(error);
            }
          });
      });
      
      const cancelablePromise = {
        promise: wrappedPromise,
        cancel: () => {
          isCanceled = true;
          cancelablePromises.delete(cancelablePromise);
        }
      };
      
      cancelablePromises.add(cancelablePromise);
      return cancelablePromise;
    }
    
    function cancelAll() {
      console.log(`取消 ${cancelablePromises.size} 个Promise`);
      cancelablePromises.forEach(cancelablePromise => {
        cancelablePromise.cancel();
      });
      cancelablePromises.clear();
    }
    
    return { makeCancelable, cancelAll };
  }
  
  // 使用示例
  const { makeCancelable, cancelAll } = useCancelablePromise();
  
  // 创建多个可取消的Promise
  const promises = [
    makeCancelable(new Promise(resolve => setTimeout(() => resolve('Promise 1 完成'), 1000))),
    makeCancelable(new Promise(resolve => setTimeout(() => resolve('Promise 2 完成'), 2000))),
    makeCancelable(new Promise(resolve => setTimeout(() => resolve('Promise 3 完成'), 3000)))
  ];
  
  promises.forEach((cancelablePromise, index) => {
    cancelablePromise.promise
      .then(result => console.log(`✓ ${result}`))
      .catch(error => console.log(`✗ Promise ${index + 1} 被取消或失败`));
  });
  
  // 1.5秒后取消所有Promise
  setTimeout(() => {
    cancelAll();
  }, 1500);
}, 12000);

console.log('\n高级示例已启动，请等待执行结果...');