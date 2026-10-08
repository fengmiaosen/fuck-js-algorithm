/**
 * 经典输出题：then 的值穿透、错误穿透与 catch 恢复
 *
 * 运行：node index.js   —— 先自己写出答案，再对照文件末尾的注释和 readme.md
 *
 * 说明：每个小题都用 await 包起来，让输出按题号分组。
 * 如果不 await，所有题目会同时挂到微任务队列上，输出会交错在一起——
 * 这本身就是「then 回调都是异步微任务」的最好证明。
 */

const line = (title) => console.log(`\n===== ${title} =====`)

// ------------------------------------------------------------
// Q1 值穿透：then 不传成功回调时，值会原样往后传
// ------------------------------------------------------------
async function q1() {
    line('Q1 值穿透')
    await Promise.resolve('A')
        .then(null)
        .then(undefined)
        .then((v) => console.log('Q1:', v))
}

// ------------------------------------------------------------
// Q2 回调返回 undefined 会把值「吃掉」，这与值穿透不是一回事
// ------------------------------------------------------------
async function q2() {
    line('Q2 返回 undefined 会吃掉值')
    await Promise.resolve('B')
        .then((v) => {
            console.log('Q2 第一个 then 收到:', v)
            // 没有 return，等价于 return undefined
        })
        .then((v) => console.log('Q2 第二个 then 收到:', v))
}

// ------------------------------------------------------------
// Q3 错误穿透：中间的 then 被跳过，直达最近的 catch
// ------------------------------------------------------------
async function q3() {
    line('Q3 错误穿透')
    await Promise.reject(new Error('boom'))
        .then((v) => console.log('Q3 这一行不会执行:', v))
        .then((v) => console.log('Q3 这一行也不会执行:', v))
        .catch((e) => console.log('Q3 catch 捕获:', e.message))
        .then((v) => console.log('Q3 catch 之后恢复为:', v))
}

// ------------------------------------------------------------
// Q4 catch 里 return 普通值 → 链恢复 fulfilled
// Q5 catch 里 throw        → 继续冒泡到下一个 catch
// ------------------------------------------------------------
async function q4() {
    line('Q4 catch 返回普通值 → 链恢复')
    await Promise.reject('E1')
        .catch((e) => `recovered:${e}`) // 返回普通值
        .then((v) => console.log('Q4 恢复成功:', v))
}

async function q5() {
    line('Q5 catch 继续 throw → 向后冒泡')
    await Promise.reject('E2')
        .catch((e) => {
            throw new Error(`still ${e}`) // 继续抛错
        })
        .then((v) => console.log('Q5 这一行不会执行:', v))
        .catch((e) => console.log('Q5 继续冒泡到第二个 catch:', e.message))
}

// ------------------------------------------------------------
// Q6 同一个 then 的 onRejected 【不会】捕获 onFulfilled 抛出的错
// ------------------------------------------------------------
async function q6() {
    line('Q6 同一个 then 里的 onRejected 捕获不到 onFulfilled 的错误')
    await Promise.resolve('X')
        .then(
            () => {
                throw new Error('onFulfilled 抛错了')
            },
            () => console.log('Q6 这一行不会执行：它只管上游的错误')
        )
        .catch((e) => console.log('Q6 由后续的 catch 捕获:', e.message))
}

// ------------------------------------------------------------
// Q7 状态不可逆：resolve 之后的 reject 无效；同一个 promise 可以被多个 then 订阅
// ------------------------------------------------------------
async function q7() {
    line('Q7 状态不可逆')
    const once = new Promise((resolve, reject) => {
        resolve('ok')
        reject(new Error('无效的 reject')) // 空操作
    })
    await once.then(
        (v) => console.log('Q7 第一个 then:', v),
        (e) => console.log('Q7 不会执行:', e.message)
    )
    await once.then((v) => console.log('Q7 第二个 then 拿到同一个值:', v))
}

// ------------------------------------------------------------
// Q8 executor 同步执行，then 回调异步（微任务）执行
// ------------------------------------------------------------
async function q8() {
    line('Q8 executor 同步、回调异步')
    const sync = new Promise((resolve) => {
        console.log('Q8 executor 里的代码同步执行')
        resolve('ok')
    })
    console.log('Q8 同步代码先打印')
    await sync.then((v) => console.log('Q8 then 回调最后打印:', v))
}

// ------------------------------------------------------------
// Q9 已经 catch 过的错误，后面再 catch 不会执行
// ------------------------------------------------------------
async function q9() {
    line('Q9 错误被捕获后不再向后传递')
    await Promise.reject(new Error('once'))
        .catch((e) => console.log('Q9 第一个 catch:', e.message))
        .catch(() => console.log('Q9 第二个 catch 不会执行'))
}

;(async () => {
    await q1()
    await q2()
    await q3()
    await q4()
    await q5()
    await q6()
    await q7()
    await q8()
    await q9()
})()

/* 正确输出（可先遮住这里自测）：
 *
 * ===== Q1 值穿透 =====
 * Q1: A
 *
 * ===== Q2 返回 undefined 会吃掉值 =====
 * Q2 第一个 then 收到: B
 * Q2 第二个 then 收到: undefined
 *
 * ===== Q3 错误穿透 =====
 * Q3 catch 捕获: boom
 * Q3 catch 之后恢复为: undefined
 *
 * ===== Q4 catch 返回普通值 → 链恢复 =====
 * Q4 恢复成功: recovered:E1
 *
 * ===== Q5 catch 继续 throw → 向后冒泡 =====
 * Q5 继续冒泡到第二个 catch: still E2
 *
 * ===== Q6 同一个 then 里的 onRejected 捕获不到 onFulfilled 的错误 =====
 * Q6 由后续的 catch 捕获: onFulfilled 抛错了
 *
 * ===== Q7 状态不可逆 =====
 * Q7 第一个 then: ok
 * Q7 第二个 then 拿到同一个值: ok
 *
 * ===== Q8 executor 同步、回调异步 =====
 * Q8 executor 里的代码同步执行
 * Q8 同步代码先打印
 * Q8 then 回调最后打印: ok
 *
 * ===== Q9 错误被捕获后不再向后传递 =====
 * Q9 第一个 catch: once
 */
