/**
 * 经典面试题：async / await 与 promise 的执行顺序
 *
 * 覆盖：微任务顺序、await 让出执行权、async 返回值、await 的错误捕获、
 *       return await 与 return 的区别
 *
 * 运行：node index.js
 */

const line = (title) => console.log(`\n===== ${title} =====`)

// ------------------------------------------------------------
// Q1 最经典的顺序题（建议先自己写答案）
// ------------------------------------------------------------
async function q1() {
    line('Q1 async / await 执行顺序')
    async function async1() {
        console.log('async1 start')
        await async2()
        console.log('async1 end')
    }
    async function async2() {
        console.log('async2')
    }

    console.log('script start')
    setTimeout(() => console.log('setTimeout'), 0)
    async1()
    new Promise((resolve) => {
        console.log('promise1')
        resolve()
    }).then(() => console.log('promise2'))
    console.log('script end')

    await new Promise((resolve) => setTimeout(resolve, 0))
}

// ------------------------------------------------------------
// Q2 await 一个普通值，也会让出执行权（进微任务）
// ------------------------------------------------------------
async function q2() {
    line('Q2 await 普通值也会让出执行权')
    console.log('Q2 a')

    const task = (async () => {
        await 1 // 不是 promise，也照样让出
        console.log('Q2 await 之后的代码')
    })()

    Promise.resolve().then(() => console.log('Q2 then 回调'))
    console.log('Q2 同步代码')

    await task
}

// ------------------------------------------------------------
// Q3 async 函数永远返回一个新的 promise；return promise 会被「跟随」
// ------------------------------------------------------------
async function q3() {
    line('Q3 async 的返回值')
    async function f1() {
        return 1
    }
    async function f2() {
        return Promise.resolve(2)
    }

    const r1 = f1()
    const r2 = f2()
    console.log('Q3 返回的一定是 promise:', r1 instanceof Promise, r2 instanceof Promise)
    console.log('Q3 值:', await r1, await r2)

    const inner = Promise.resolve('inner')
    async function f3() {
        return inner
    }
    const r3 = f3()
    console.log('Q3 async 返回的 promise 不是 inner 本身:', r3 !== inner, '| 值为:', await r3)
}

// ------------------------------------------------------------
// Q4 await 的 rejection 可以用 try / catch 捕获
// ------------------------------------------------------------
async function q4() {
    line('Q4 try / catch 捕获 await 的错误')
    try {
        await Promise.reject(new Error('await 的错误'))
    } catch (e) {
        console.log('Q4 捕获:', e.message)
    }
}

// ------------------------------------------------------------
// Q5 return await 与 return 的区别
//    区别只在 try / catch 里才暴露出来
// ------------------------------------------------------------
async function q5() {
    line('Q5 return await 与 return 的区别')

    async function withAwait() {
        try {
            return await Promise.reject(new Error('with await'))
        } catch (e) {
            return `caught: ${e.message}`
        }
    }

    async function withoutAwait() {
        try {
            // 没有 await，错误发生在 return 出去之后，本地 catch 抓不到
            return Promise.reject(new Error('without await'))
        } catch (e) {
            return `caught: ${e.message}`
        }
    }

    console.log('Q5 return await :', await withAwait())
    console.log(
        'Q5 return       :',
        await withoutAwait().catch((e) => `uncaught: ${e.message}`)
    )
}

// ------------------------------------------------------------
// Q6 async 函数里 throw，等价于返回一个 rejected promise
// ------------------------------------------------------------
async function q6() {
    line('Q6 async 里 throw')
    async function boom() {
        throw new Error('async throw')
    }
    await boom().catch((e) => console.log('Q6 被 catch 捕获:', e.message))
}

// ------------------------------------------------------------
// Q7 await 一个 thenable：await 内部同样走决议程序
// ------------------------------------------------------------
async function q7() {
    line('Q7 await 一个 thenable')
    const thenable = {
        then(resolve) {
            console.log('Q7 thenable.then 被调用')
            resolve('thenable-value')
        }
    }

    console.log('Q7 await 之前')
    const value = await thenable
    console.log('Q7 await 之后:', value)
}

;(async () => {
    await q1()
    await q2()
    await q3()
    await q4()
    await q5()
    await q6()
    await q7()
})()

/* 正确输出：
 *
 * ===== Q1 async / await 执行顺序 =====
 * script start
 * async1 start
 * async2
 * promise1
 * script end
 * async1 end
 * promise2
 * setTimeout
 *
 * ===== Q2 await 普通值也会让出执行权 =====
 * Q2 a
 * Q2 同步代码
 * Q2 await 之后的代码
 * Q2 then 回调
 *
 * ===== Q3 async 的返回值 =====
 * Q3 返回的一定是 promise: true true
 * Q3 值: 1 2
 * Q3 async 返回的 promise 不是 inner 本身: true | 值为: inner
 *
 * ===== Q4 try / catch 捕获 await 的错误 =====
 * Q4 捕获: await 的错误
 *
 * ===== Q5 return await 与 return 的区别 =====
 * Q5 return await : caught: with await
 * Q5 return       : uncaught: without await
 *
 * ===== Q6 async 里 throw =====
 * Q6 被 catch 捕获: async throw
 *
 * ===== Q7 await 一个 thenable =====
 * Q7 await 之前
 * Q7 thenable.then 被调用
 * Q7 await 之后: thenable-value
 */
