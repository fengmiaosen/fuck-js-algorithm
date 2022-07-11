console.log(1);

setTimeout(() => {
    console.log(2);
    
    process.nextTick(() => {
        console.log(3);
    });

    new Promise((resolve) => {
        console.log(4);

        resolve();
    }).then(() => {
        console.log(5);
    });
});

new Promise((resolve) => {
    console.log(7);
    resolve();
}).then(() => {
    console.log(8);
});

// https://juejin.cn/post/6844903657264136200#heading-8
// 认为是一个类似于Promise和MutationObserver的微任务实现，在代码执行的过程中可以随时插入nextTick，并且会保证在下一个宏任务开始之前所执行
process.nextTick(() => {
    console.log(6);
});

setTimeout(() => {
    console.log(9);
    process.nextTick(() => {
        console.log(10);
    });
    new Promise((resolve) => {
        console.log(11);
        resolve();
    }).then(() => {
        console.log(12);
    });
});

/**
 * 1
 * 7
 * 6
 * 8
 * 2
 * 4
 * 3
 * 5
 * 9
 * 11
 * 10
 * 12
 */