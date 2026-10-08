/**
 * 经典面试题：then 返回 promise / thenable 时发生了什么
 *
 * 覆盖：递归展开（thenable）、跟随、循环引用、多等两拍微任务的顺序题
 *
 * 运行：node index.js
 */

const line = (title) => console.log(`\n===== ${title} =====`)

// ------------------------------------------------------------
// Q1 then 里 return 一个 promise，链会「等待」它，而不是立刻把 promise 本身传下去
// ------------------------------------------------------------
async function q1() {
    line('Q1 return promise 会被展开')
    await Promise.resolve(1)
        .then((v) => {
            console.log('Q1 第一个 then 收到:', v)
            return Promise.resolve(v + 1) // 返回 promise 而不是值
        })
        .then((v) => console.log('Q1 第二个 then 收到的是展开后的值:', v))
}

// ------------------------------------------------------------
// Q2 resolve 一个 thenable 对象：采用它的状态
// ------------------------------------------------------------
async function q2() {
    line('Q2 resolve(thenable) 采用其状态')
    const thenable = {
        then(resolve) {
            console.log('Q2 thenable 的 then 被调用')
            setTimeout(() => resolve('thenable-value'), 10)
        }
    }

    await new Promise((resolve) => resolve(thenable)).then((v) =>
        console.log('Q2 结果:', v)
    )
}

// ------------------------------------------------------------
// Q3 Promise.resolve(p) 原样返回 p，但 new Promise(r => r(p)) 会「跟随」 p
// ------------------------------------------------------------
async function q3() {
    line('Q3 Promise.resolve(p) vs new Promise(r => r(p))')
    const p = Promise.resolve('inner')

    console.log('Q3 Promise.resolve(p) === p:', Promise.resolve(p) === p)

    const followed = new Promise((resolve) => resolve(p))
    console.log('Q3 followed === p:', followed === p)
    console.log('Q3 followed 的值:', await followed)
}

// ------------------------------------------------------------
// Q4 循环引用：then 的回调里返回自己所在的 promise
// ------------------------------------------------------------
async function q4() {
    line('Q4 返回自身的循环引用')
    const self = Promise.resolve().then(() => self)
    const error = await self.then(
        () => null,
        (e) => e
    )
    console.log(`Q4 ${error.constructor.name} | ${error.message}`)
}

// ------------------------------------------------------------
// Q5 顺序题：return 值 与 return promise 相差两拍微任务
// ------------------------------------------------------------
async function q5() {
    line('Q5 return promise 会多等两拍微任务')

    Promise.resolve()
        .then(() => {
            console.log('Q5 t1')
            return Promise.resolve() // 返回 promise，需要展开
        })
        .then(() => console.log('Q5 t2'))

    Promise.resolve()
        .then(() => console.log('Q5 t3'))
        .then(() => console.log('Q5 t4'))

    // 用宏任务确保上面的微任务全部执行完
    await new Promise((resolve) => setTimeout(resolve, 0))
    console.log('Q5 顺序: t1 → t3 → t4 → t2')
}

// ------------------------------------------------------------
// Q6 thenable 的 then 不是函数 → 当成普通值
// ------------------------------------------------------------
async function q6() {
    line('Q6 then 不是函数时按普通值处理')
    await Promise.resolve()
        .then(() => ({ then: 'not-a-function' }))
        .then((v) => console.log('Q6 拿到的对象:', v))
}

// ------------------------------------------------------------
// Q7 thenable 的 then 内部抛错 → 外层 promise 变为 rejected
// ------------------------------------------------------------
async function q7() {
    line('Q7 thenable 内部抛错 → rejected')
    await new Promise((resolve) =>
        resolve({
            then() {
                throw new Error('then 内部抛错')
            }
        })
    ).catch((e) => console.log('Q7 捕获:', e.message))
}

// ------------------------------------------------------------
// Q8 thenable 同时调用 resolve 和 reject，只认第一次
// ------------------------------------------------------------
async function q8() {
    line('Q8 thenable 同时 resolve 和 reject 只认第一次')
    await new Promise((resolve) =>
        resolve({
            then(res, rej) {
                res('第一次生效')
                rej(new Error('第二次被忽略'))
            }
        })
    ).then(
        (v) => console.log('Q8 resolve:', v),
        (e) => console.log('Q8 reject:', e.message)
    )
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
})()

/* 正确输出：
 *
 * ===== Q1 return promise 会被展开 =====
 * Q1 第一个 then 收到: 1
 * Q1 第二个 then 收到的是展开后的值: 2
 *
 * ===== Q2 resolve(thenable) 采用其状态 =====
 * Q2 thenable 的 then 被调用
 * Q2 结果: thenable-value
 *
 * ===== Q3 Promise.resolve(p) vs new Promise(r => r(p)) =====
 * Q3 Promise.resolve(p) === p: true
 * Q3 followed === p: false
 * Q3 followed 的值: inner
 *
 * ===== Q4 返回自身的循环引用 =====
 * Q4 TypeError | Chaining cycle detected for promise #<Promise>
 *
 * ===== Q5 return promise 会多等两拍微任务 =====
 * Q5 t1
 * Q5 t3
 * Q5 t4
 * Q5 t2
 * Q5 顺序: t1 → t3 → t4 → t2
 *
 * ===== Q6 then 不是函数时按普通值处理 =====
 * Q6 拿到的对象: { then: 'not-a-function' }
 *
 * ===== Q7 thenable 内部抛错 → rejected =====
 * Q7 捕获: then 内部抛错
 *
 * ===== Q8 thenable 同时 resolve 和 reject 只认第一次 =====
 * Q8 resolve: 第一次生效
 */
