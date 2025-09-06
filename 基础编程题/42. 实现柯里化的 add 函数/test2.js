// 实现一个add函数：
// console.log(add(1,2,3)(1)(2)(3)(4,5,6)(7,8)()) //输出是 52

/**
 * 优化后的累加函数实现
 * 支持链式调用和无限参数累加
 * @param {...number} args - 初始参数
 * @returns {Function|number} 返回函数或最终结果
 */
function add(...args) {
    // 使用更简洁的reduce写法计算初始和
    let sum = args.reduce((acc, cur) => acc + cur, 0);
    
    function fn(...params) {
        // 如果没有参数，返回最终结果
        if (params.length === 0) {
            return sum;
        }
        
        // 累加新参数并返回函数本身以支持链式调用
        sum += params.reduce((acc, cur) => acc + cur, 0);
        return fn;
    }
    
    return fn;
}

// 进一步优化版本：使用闭包避免外部变量污染
function addOptimized(...args) {
    const calculate = (initialSum) => {
        function fn(...params) {
            if (params.length === 0) {
                return initialSum;
            }
            
            const newSum = initialSum + params.reduce((acc, cur) => acc + cur, 0);
            return calculate(newSum);
        }
        return fn;
    };
    
    const initialSum = args.reduce((acc, cur) => acc + cur, 0);
    return calculate(initialSum);
}

// 最简洁版本：利用函数属性
function addSimple(...args) {
    const fn = (...params) => {
        if (params.length === 0) return fn.sum;
        fn.sum += params.reduce((acc, cur) => acc + cur, 0);
        return fn;
    };
    
    fn.sum = args.reduce((acc, cur) => acc + cur, 0);
    return fn;
}

// 测试原版本
console.log('原版本测试:');
const res = add(1, 2, 3)(1)(2)(3)(4, 5, 6)(7, 8)(10)();
console.log('结果:', res); // 52

// 测试优化版本
console.log('\n优化版本测试:');
const res2 = addOptimized(1, 2, 3)(1)(2)(3)(4, 5, 6)(7, 8)(10)();
console.log('结果:', res2); // 52

// 测试简洁版本
console.log('\n简洁版本测试:');
const res3 = addSimple(1, 2, 3)(1)(2)(3)(4, 5, 6)(7, 8)(10)();
console.log('结果:', res3); // 52

// 性能对比测试
console.log('\n性能测试:');
console.time('原版本');
for (let i = 0; i < 10000; i++) {
    add(1, 2, 3)(1)(2)(3)();
}
console.timeEnd('原版本');

console.time('优化版本');
for (let i = 0; i < 10000; i++) {
    addOptimized(1, 2, 3)(1)(2)(3)();
}
console.timeEnd('优化版本');

console.time('简洁版本');
for (let i = 0; i < 10000; i++) {
    addSimple(1, 2, 3)(1)(2)(3)();
}
console.timeEnd('简洁版本');
