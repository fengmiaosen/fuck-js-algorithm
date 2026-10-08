/**
 * 经典面试题：loadUrl 支持 then 串行链式调用，中间还能插入 catch
 *
 * 题目：
 *   有一个 loadUrl(url) 返回 promise，要求它支持多个 then 串行调用，
 *   并且满足下面的链式语义：
 *     1. 每一步 then 都能拿到上一步的「返回值」，而不是上一个回调本身
 *     2. 链中间可以插入 catch，上游任意一步出错都会跳过中间的 then，直达最近的 catch
 *     3. catch 里 return 一个普通值以后，链会「恢复成功」，后面的 then 继续执行
 *     4. 所有回调都是异步执行的，但同一个链上的执行顺序严格串行
 *
 * 这里不用原生 Promise，直接用上一节手写的 MyPromise 实现，方便对照内部原理。
 */

const MyPromise = require('./MyPromise')

// 模拟 ajax：把 setTimeout 包成 promise
const mockRequest = (url, delay = 20) =>
    new MyPromise((resolve, reject) => {
        setTimeout(() => {
            if (url === '/api/user') {
                resolve({ name: 'Tom', age: 18 })
            } else {
                reject(new Error(`404 Not Found: ${url}`))
            }
        }, delay)
    })

/**
 * 题目要求的 loadUrl
 * @param {string} url 请求地址
 * @returns {MyPromise}
 */
function loadUrl(url) {
    return mockRequest(url)
}

// 只是为了演示「串行」而准备的可等待函数
const sleep = (ms, tag) =>
    new MyPromise((resolve) => setTimeout(() => resolve(tag), ms))

const start = Date.now()
const stamp = () => `[+${Date.now() - start}ms]`

// ============================================================
// 场景一：正常请求，多个 then 串行，中间夹一个 catch
// ============================================================
console.log('=== 场景一：多个 then 串行 + 中间 catch ===')

loadUrl('/api/user')
    .then((user) => {
        console.log(`${stamp()} then1 收到:`, user)
        return user.name // 返回普通值，交给下一个 then
    })
    .then((name) => {
        console.log(`${stamp()} then2 收到:`, name)
        return sleep(30, `${name}'s age is 18`) // 返回 promise，链会等它完成
    })
    .catch((error) => {
        // 本场景不会走到这里：上游全部成功时 catch 直接穿透
        console.log(`${stamp()} catch 收到:`, error.message)
        return '兜底数据'
    })
    .then((result) => {
        console.log(`${stamp()} catch 之后的 then 收到:`, result)
        console.log('--- 场景一结束（30ms 的 sleep 被等到，说明链是串行的）---')
    })

// ============================================================
// 场景二：请求失败，错误跳过中间的 then，被 catch 捕获后链恢复
// ============================================================
setTimeout(() => {
    console.log('\n=== 场景二：失败被 catch 捕获后链继续 ===')

    loadUrl('/api/not-exist')
        .then((res) => {
            console.log('这一行不会执行：错误会跳过它')
            return res
        })
        .then((res) => {
            console.log('这一行也不会执行')
            return res
        })
        .catch((error) => {
            console.log(`${stamp()} catch 捕获:`, error.message)
            return '降级数据' // return 普通值 → 链恢复成功
        })
        .then((value) => {
            console.log(`${stamp()} 恢复后的 then 收到:`, value)
        })
}, 120)

// ============================================================
// 场景三：串行 vs 并行 —— 证明 then 链是「串行」而不是「并行」
// ============================================================
setTimeout(() => {
    console.log('\n=== 场景三：then 链串行 vs Promise.all 并行 ===')

    const serialStart = Date.now()
    sleep(50, 'step1')
        .then((v1) => {
            console.log('串行 step1:', v1)
            return sleep(50, 'step2')
        })
        .then((v2) => {
            console.log('串行 step2:', v2)
            console.log(`串行总耗时: ${Date.now() - serialStart}ms（约 100ms = 50 + 50）`)

            const parallelStart = Date.now()
            return Promise.all([sleep(50, 'a'), sleep(50, 'b')]).then(() => {
                console.log(
                    `并行总耗时: ${Date.now() - parallelStart}ms（约 50ms = max(50, 50)）`
                )
            })
        })
}, 250)
