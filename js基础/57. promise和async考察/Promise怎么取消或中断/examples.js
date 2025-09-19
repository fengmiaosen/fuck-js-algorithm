// Promise 取消和中断机制示例

console.log('=== Promise 取消机制演示 ===\n');

// 方法一：AbortController 示例
console.log('1. AbortController 基本用法:');
function abortControllerExample() {
  const controller = new AbortController();
  const signal = controller.signal;
  
  // 模拟异步操作
  const promise = new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (!signal.aborted) {
        resolve('AbortController: 任务完成');
      }
    }, 2000);
    
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new Error('AbortController: 操作被取消'));
    });
  });
  
  promise
    .then(result => console.log(result))
    .catch(error => console.log(error.message));
  
  // 1秒后取消
  setTimeout(() => {
    console.log('AbortController: 1秒后取消操作');
    controller.abort();
  }, 1000);
}

abortControllerExample();

// 方法二：Promise.race 竞态取消
setTimeout(() => {
  console.log('\n2. Promise.race 竞态取消:');
  
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
      cancel: () => cancelReject(new Error('Promise.race: 操作被取消'))
    };
  }
  
  const originalPromise = new Promise(resolve => {
    setTimeout(() => resolve('Promise.race: 原始任务完成'), 2000);
  });
  
  const { promise, cancel } = createRaceCancelablePromise(originalPromise);
  
  promise
    .then(result => console.log(result))
    .catch(error => console.log(error.message));
  
  // 1秒后取消
  setTimeout(() => {
    console.log('Promise.race: 1秒后取消操作');
    cancel();
  }, 1000);
}, 2500);

// 方法三：自定义取消Token
setTimeout(() => {
  console.log('\n3. 自定义取消Token:');
  
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
      if (cancelToken.isCancelled) {
        reject(new Error(cancelToken.reason));
        return;
      }
      
      cancelToken.onCancel(reason => {
        reject(new Error(reason));
      });
      
      executor(resolve, reject, cancelToken);
    });
  }
  
  const cancelToken = new CancelToken();
  
  const promise = createTokenCancelablePromise((resolve, reject, token) => {
    const timer = setTimeout(() => {
      try {
        token.throwIfCancelled();
        resolve('CancelToken: 任务完成');
      } catch (error) {
        reject(error);
      }
    }, 2000);
    
    token.onCancel(() => {
      clearTimeout(timer);
    });
  }, cancelToken);
  
  promise
    .then(result => console.log(result))
    .catch(error => console.log(error.message));
  
  // 1秒后取消
  setTimeout(() => {
    console.log('CancelToken: 1秒后取消操作');
    cancelToken.cancel('CancelToken: 用户主动取消');
  }, 1000);
}, 5000);

// 方法四：包装器模式
setTimeout(() => {
  console.log('\n4. 包装器模式:');
  
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
  }
  
  const cancelablePromise = new CancelablePromise((resolve, reject) => {
    setTimeout(() => {
      resolve('包装器模式: 任务完成');
    }, 2000);
  });
  
  cancelablePromise
    .then(result => console.log(result))
    .catch(error => console.log(error.message));
  
  // 1秒后取消
  setTimeout(() => {
    console.log('包装器模式: 1秒后取消操作');
    cancelablePromise.cancel('包装器模式: 用户取消操作');
  }, 1000);
}, 7500);

// 实际应用：HTTP请求取消模拟
setTimeout(() => {
  console.log('\n5. HTTP请求取消模拟:');
  
  class HttpClient {
    constructor() {
      this.pendingRequests = new Map();
    }
    
    async request(url, options = {}) {
      const controller = new AbortController();
      const requestId = Date.now() + Math.random();
      
      this.pendingRequests.set(requestId, controller);
      
      try {
        // 模拟fetch请求
        const response = await new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            if (!controller.signal.aborted) {
              resolve({ data: `来自 ${url} 的数据` });
            }
          }, 2000);
          
          controller.signal.addEventListener('abort', () => {
            clearTimeout(timer);
            reject(new Error('请求被取消'));
          });
        });
        
        this.pendingRequests.delete(requestId);
        return response;
      } catch (error) {
        this.pendingRequests.delete(requestId);
        throw error;
      }
    }
    
    cancelAllRequests() {
      console.log(`取消 ${this.pendingRequests.size} 个待处理请求`);
      this.pendingRequests.forEach(controller => {
        controller.abort();
      });
      this.pendingRequests.clear();
    }
  }
  
  const client = new HttpClient();
  
  // 发起多个请求
  client.request('/api/data1')
    .then(data => console.log('请求1成功:', data))
    .catch(error => console.log('请求1失败:', error.message));
  
  client.request('/api/data2')
    .then(data => console.log('请求2成功:', data))
    .catch(error => console.log('请求2失败:', error.message));
  
  // 1秒后取消所有请求
  setTimeout(() => {
    client.cancelAllRequests();
  }, 1000);
}, 10000);

// 超时取消示例
setTimeout(() => {
  console.log('\n6. 超时取消示例:');
  
  function withTimeout(promise, timeout) {
    return Promise.race([
      promise,
      new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`操作超时 (${timeout}ms)`));
        }, timeout);
      })
    ]);
  }
  
  const slowPromise = new Promise(resolve => {
    setTimeout(() => resolve('慢操作完成'), 3000);
  });
  
  withTimeout(slowPromise, 2000)
    .then(result => console.log(result))
    .catch(error => console.log('超时取消:', error.message));
}, 12500);

console.log('\n所有示例已启动，请等待执行结果...');