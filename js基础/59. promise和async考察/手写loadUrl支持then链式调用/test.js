/**
 * 对拍测试：同一套用例分别跑「原生 Promise」和「手写 MyPromise」，
 * 比较输出序列是否完全一致，并校验几个边界行为。
 *
 * 运行：node test.js
 */

const assert = require('assert')
const MyPromise = require('./MyPromise')

// 用例覆盖：多级 then、中间 catch、catch 后恢复、值穿透、错误穿透、返回 promise、finally
function runCases(P, done) {
    const trace = []

    P.resolve(1)
        .then((v) => {
            trace.push(`then1:${v}`)
            return v + 1
        })
        .then((v) => {
            trace.push(`then2:${v}`)
            throw new Error('boom')
        })
        .then(() => trace.push('should-skip')) // 上游失败，这里会被跳过
        .catch((e) => {
            trace.push(`catch1:${e.message}`)
            return 'recovered' // catch 返回普通值，链恢复成功
        })
        .then((v) => {
            trace.push(`then3:${v}`)
            return P.resolve('nested-promise') // 返回 promise，链会等它
        })
        .then((v) => trace.push(`then4:${v}`))
        .then(() => P.reject(new Error('again')))
        .then(null) // 值穿透：不传成功回调
        .then(undefined) // 错误穿透：不传失败回调
        .catch((e) => trace.push(`catch2:${e.message}`))
        .finally(() => trace.push('finally'))
        .then(() => done(trace))
}

const collect = (P) => new Promise((resolve) => runCases(P, resolve))

const print = (title, trace) => {
    console.log(`${title}:`)
    trace.forEach((line, index) => console.log(`  ${index + 1}. ${line}`))
}

;(async () => {
    const nativeTrace = await collect(Promise)
    const myTrace = await collect(MyPromise)

    print('原生 Promise 输出序列', nativeTrace)
    print('手写 MyPromise 输出序列', myTrace)

    assert.deepStrictEqual(myTrace, nativeTrace)
    console.log('\n✅ 手写实现与原生 Promise 的输出序列完全一致')

    // 边界 1：resolve 已经是 MyPromise 的实例时应原样返回
    const p = MyPromise.resolve(1)
    assert.strictEqual(MyPromise.resolve(p), p)
    console.log('✅ MyPromise.resolve(p) === p（与原生一致，不会多包一层）')

    // 边界 2：then 的回调里返回自己所在的 promise → 循环引用
    const self = MyPromise.resolve().then(() => self)
    const cycleError = await self.then(() => null, (e) => e)
    assert.ok(cycleError instanceof TypeError, '返回自身应抛出 TypeError')
    console.log(`✅ 循环引用检测: ${cycleError.constructor.name} | ${cycleError.message}`)

    // 边界 3：手写 promise 也是 thenable，可以被 async/await 直接消费
    const awaited = await MyPromise.resolve('await-me')
    assert.strictEqual(awaited, 'await-me')
    console.log(`✅ 手写 promise 可以被 await 消费: ${awaited}`)

    // 边界 4：状态不可逆
    const irreversible = new MyPromise((resolve, reject) => {
        resolve('first')
        reject(new Error('second'))
    })
    const settled = await irreversible.then((v) => v, (e) => e.message)
    assert.strictEqual(settled, 'first')
    console.log('✅ 状态不可逆：resolve 之后再调用 reject 无效')

    console.log('\n🎉 全部用例通过')
})().catch((error) => {
    console.error('❌ 用例失败:', error)
    process.exitCode = 1
})
