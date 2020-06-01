// 在官方文档中的定义，setImmediate为一次Event Loop执行完毕后调用。
// setTimeout则是通过计算一个延迟时间后进行执行。
// 但是同时还提到了如果在主进程中直接执行这两个操作，很难保证哪个会先触发。
// 因为如果主进程中先注册了两个任务，然后执行的代码耗时超过XXs，而这时定时器已经处于可执行回调的状态了。
// 所以会先执行定时器，而执行完定时器以后才是结束了一次Event Loop，这时才会执行setImmediate。



setTimeout(_ => console.log('setTimeout'))
setImmediate(_ => console.log('setImmediate'))
