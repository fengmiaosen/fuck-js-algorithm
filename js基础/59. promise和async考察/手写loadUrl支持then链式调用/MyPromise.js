/**
 * MyPromise —— 手写一个迷你 Promise，只保留面试真正考察的核心语义
 *
 * 目标：让 then 可以无限串行链式调用，并且链中间可以插入 catch。
 *
 * 需要覆盖的语义：
 *   1. executor 同步执行；resolve / reject 只生效一次（状态不可逆）
 *   2. then 返回一个全新的 promise —— 这是「链式调用」的根基
 *   3. 回调统一用微任务调度，保证与原生 Promise 的执行顺序一致
 *   4. 值穿透 / 错误穿透：回调不是函数时，把结果原样传给下一个 then
 *   5. resolve 一个 thenable 时递归展开，采用它的状态（会多等几拍微任务）
 *   6. 回调里 throw 让下一个 promise 失败，return 让它成功
 *   7. 回调返回自己所在的 promise 时抛出 Chaining cycle 错误
 */

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

const isFunction = (value) => typeof value === 'function'
const isThenable = (value) =>
    value !== null && (typeof value === 'object' || isFunction(value))

// 微任务调度：优先 queueMicrotask（浏览器 / Node 都支持），降级到 setTimeout
const microtask =
    typeof queueMicrotask === 'function'
        ? queueMicrotask
        : (callback) => setTimeout(callback, 0)

class MyPromise {
    constructor(executor) {
        this.state = PENDING
        this.value = undefined
        // 状态还没确定时，先把手上的 then 回调存进队列
        this.handlers = []

        const resolve = (value) => this._resolve(value)
        const reject = (reason) => this._reject(reason)

        try {
            // executor 是同步执行的，所以下面的 resolve 里能直接读到结果
            executor(resolve, reject)
        } catch (error) {
            // executor 内部同步抛错，直接让 promise 失败
            reject(error)
        }
    }

    _resolve(value) {
        this._settle(FULFILLED, value, true)
    }

    _reject(reason) {
        this._settle(REJECTED, reason, false)
    }

    _settle(state, value, isResolve) {
        // 状态只能从 pending 变更一次，之后所有调用都是空操作
        if (this.state !== PENDING) return

        if (isResolve) {
            // 1）循环引用：then 的回调里返回了自己所在的 promise
            if (value === this) {
                return this._settle(
                    REJECTED,
                    new TypeError('Chaining cycle detected for promise'),
                    false
                )
            }

            // 2）value 是 thenable（promise / 类 promise 对象）：递归展开，采用它的状态
            if (isThenable(value)) {
                let then
                try {
                    then = value.then
                } catch (error) {
                    return this._settle(REJECTED, error, false)
                }

                if (isFunction(then)) {
                    let called = false // 防止 thenable 同时调用 resolve 和 reject
                    try {
                        then.call(
                            value,
                            (next) => {
                                if (called) return
                                called = true
                                this._settle(FULFILLED, next, true)
                            },
                            (reason) => {
                                if (called) return
                                called = true
                                this._settle(REJECTED, reason, false)
                            }
                        )
                    } catch (error) {
                        if (!called) {
                            called = true
                            this._settle(REJECTED, error, false)
                        }
                    }
                    // 注意：此时 promise 仍是 pending，要等 thenable 自己落定
                    return
                }
            }
        }

        // 3）普通值：落定状态，并把攒下的回调依次派发出去
        this.state = state
        this.value = value
        this._flush()
    }

    _flush() {
        this.handlers.forEach((handler) => this._handle(handler))
        this.handlers = []
    }

    _handle({ onFulfilled, onRejected, resolve, reject }) {
        // 回调必须异步（微任务）执行，这是 Promise 最容易被忽略的考点
        microtask(() => {
            const callback = this.state === FULFILLED ? onFulfilled : onRejected

            // 值穿透 / 错误穿透：没传对应回调，就把结果继续往下一个 then 传
            if (!isFunction(callback)) {
                return this.state === FULFILLED
                    ? resolve(this.value)
                    : reject(this.value)
            }

            try {
                // 回调的返回值（包括返回 promise）决定下一个 promise 的状态
                resolve(callback(this.value))
            } catch (error) {
                reject(error)
            }
        })
    }

    then(onFulfilled, onRejected) {
        // 关键：then 一定返回一个全新的 promise，这是链式调用的基础
        return new MyPromise((resolve, reject) => {
            const handler = { onFulfilled, onRejected, resolve, reject }
            if (this.state === PENDING) {
                this.handlers.push(handler)
            } else {
                this._handle(handler)
            }
        })
    }

    catch(onRejected) {
        // catch 就是只传失败回调的 then
        return this.then(null, onRejected)
    }

    finally(onFinally) {
        return this.then(
            (value) =>
                MyPromise.resolve(
                    isFunction(onFinally) ? onFinally() : onFinally
                ).then(() => value),
            (reason) =>
                MyPromise.resolve(
                    isFunction(onFinally) ? onFinally() : onFinally
                ).then(() => {
                    throw reason
                })
        )
    }

    static resolve(value) {
        // 与原生一致：本身已经是 MyPromise 就原样返回，不再包一层
        if (value instanceof MyPromise) return value
        return new MyPromise((resolve, reject) => {
            if (isThenable(value) && isFunction(value.then)) {
                value.then(resolve, reject)
            } else {
                resolve(value)
            }
        })
    }

    static reject(reason) {
        return new MyPromise((resolve, reject) => reject(reason))
    }
}

module.exports = MyPromise
