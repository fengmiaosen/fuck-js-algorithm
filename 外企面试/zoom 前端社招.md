## zoom 的一面会考一些前端基本知识，二面主要结合项目进行深入的提问。

zoom 一面：
1. 了解事件循环机制么？

JS 中的事件循环（Event Loop）是一种用于管理和调度异步任务执行的机制。它使得 JS 可以处理异步操作，如定时器、事件处理、网络请求等，而不会阻塞主线程的执行。

2. 说一下什么是宏任务微任务，为什么要定义这两种任务类型？

宏任务（macro tasks）和微任务（micro tasks）是 JavaScript 引擎中用于管理异步任务执行顺序的两种任务类型。

宏任务（Macro tasks）： 是指那些需要在主线程中执行的任务，它们包括但不限于：

定时器任务（Timers）：通过 setTimeout、setInterval 创建的任务。
I/O 操作任务（I/O operations）：例如文件读写、网络请求等异步操作。
渲染事件（UI Rendering）：处理用户交互事件（例如鼠标点击、键盘事件等）的任务。
事件处理器任务（Event handlers）：事件监听器、事件回调等。
微任务（Micro tasks）： 是指在当前任务执行完成后立即执行的任务，它们通常包括：

Promise 回调（Promise callbacks）：使用 Promise 对象的 then 方法添加的回调函数。
MutationObserver 回调：通过 MutationObserver 观察 DOM 变化并触发的任务。
process.nextTick（在 Node.js 环境中）：在事件循环的当前回合结束时执行的任务。
宏任务和微任务的引入使得 JavaScript 引擎能够更好地处理异步任务。

宏任务用于表示一组相对较大的任务单元，而微任务用于表示一组相对较小、优先级较高的任务单元。

通过微任务，我们可以在宏任务执行完成后立即执行一些重要的任务，如更新 UI、处理 Promise 的回调等，以提高应用的响应速度和用户体验。

3. ES 模块和 CommonJS 模块化方案有什么区别？ - 规范来源：

ES（ECMAScript）： ES 模块化是由 ECMAScript 标准规定的，属于 JavaScript 语言本身的一部分。它在 ES6（ECMAScript 2015）中被引入，并已成为 JavaScript 的标准模块化方案。

CommonJS：CommonJS 是 Node.js 中使用的模块化规范，最初是为了解决 JavaScript 在服务器端的模块化问题而创建的。虽然它不是 JavaScript 语言的一部分，但在 Node.js 生态系统中得到了广泛应用。 - 语法和特性：

ES 模块：ES 模块使用 import 和 export 关键字来导入和导出模块。它支持静态解析，模块加载是异步的，模块的引用是动态的。

CommonJS：CommonJS 使用 require() 函数来导入模块，使用 module.exports 或 exports 来导出模块。它是同步加载的，模块的引用是静态的。

用途和环境：
ES 模块：ES 模块广泛应用于现代的 Web 开发中，可以在浏览器环境和 Node.js 环境中使用。

CommonJS：CommonJS 主要用于 Node.js 环境，用于组织服务器端的 JavaScript 代码，例如构建 web 服务器、文件系统操作等。

动态性：
ES 模块：ES 模块的静态解析意味着模块的依赖关系在代码执行前已经确定，因此它不支持动态导入。

CommonJS：CommonJS 支持动态导入，可以在运行时根据条件加载模块。

4. ES 模块中 export 出去的对象能被修改么？

在 ES 模块中，export 出去的对象默认是只读的，不能被修改。当一个对象被导出后，在其他模块中引入该对象时，只能读取其属性和方法，而不能修改它们。

5. ES 和 CommonJS 分别是如何处理循环引用的？

ES 模块：ES 模块对循环引用有着严格的限制，当发生循环引用时，ES 模块会将被引用的模块视为尚未准备好，因此会导致循环引用的模块导出一个空的对象或空值。

CommonJS 在处理循环引用时更为宽松，它会在加载模块时记录模块的导出值，即使发生循环引用也不会导致问题。CommonJS 模块系统允许循环引用中的模块导出部分已经准备好的值。

6. 使用过 decorator 和 symbol 么？

装饰器（Decorator）： 装饰器是一种用于修改类、方法、属性或参数的声明性语法。它们以 @ 符号开头，通常放置在类、方法或属性之前，并可以通过添加元数据或修改行为来扩展或修改它们的行为。

符号（Symbol）： 符号是 JavaScript 中的一种基本数据类型，用于创建唯一的、不可变的标识符。符号可以用来创建对象的私有成员、隐藏内部实现细节，或用作对象属性的键，以确保属性名称的唯一性。

7. TS 中 never 和 void 有什么区别？

void： - void 表示函数没有返回值，或者说函数返回的是 undefined。 - 当一个函数没有显式指定返回值类型时，它的返回类型默认为 void。 - 不能对 void 类型的变量赋予除 undefined 以外的值。

never: - never 表示函数永远不会正常返回，或者说函数会抛出异常或无限循环。 - 通常 never 类型用于表示永远不会执行完的函数或抛出异常的函数，或者在类型系统中表示不可能发生的情况。 - 可以将 never 类型赋值给任何其他类型，但是反过来不行。

8. 如何避免 React 多次重复渲染？

使用 PureComponent 或 React.memo
使用 useCallback 和 useMemo 进行性能优化
使用 React.lazy 延迟组件创建
9. 说一下 git rebase, git cherry-pick 的用法？

rebase:

git rebase <base>
git checkout <branch>
其中 是要重新应用提交的目标分支， 是重新应用提交的基准点（通常是另一个分支）。这将会将 上的提交按顺序逐个应用到 上，并移动 指向的提交记录。

cherry-pick:

git cherry-pick <commit-hash>
git cherry-pick 用于选择并应用一个或多个提交到当前分支上，它可以用来将某个分支上的特定提交应用到当前分支上，而不需要将整个分支合并过来。

10. 说一下什么是重绘，重排？getBoundingClientRect 会导致重排么？

重绘（Repaint）：

重绘是指当元素样式发生变化，但不影响其几何属性（如位置和大小）时，浏览器重新绘制元素的过程。换句话说，重绘只会更新元素的样式，而不会影响元素的布局。

重排（Reflow）：

重排是指当元素的几何属性发生变化，例如尺寸、位置、隐藏或显示等，导致浏览器重新计算元素的几何属性和页面布局的过程。重排可能会导致整个页面的重新布局，对性能有较大影响。

getBoundingClientRect 不会导致重排

11. position:fixed 会失效么？在哪些场景会失效？ - 父级元素使用了 transform 或 perspective 属性 - 父级元素使用了 overflow: hidden 属性

12.requestAnimationFrame 和 requestIdleCallback 有什么区别？

requestAnimationFrame: requestAnimationFrame 是一个用于在下一次浏览器重绘之前执行指定的回调函数的方法。它通常用于执行与动画相关的任务，以确保动画的流畅性和性能。

调用时机：requestAnimationFrame 的回调函数会在浏览器下一次绘制之前执行，通常在每秒约 60 次的频率下执行，这与浏览器的刷新率相匹配（通常为每秒 60 次）。

用途：requestAnimationFrame 适用于需要在动画中更新界面状态的场景，如实现平滑的动画效果、制作游戏等。

requestIdleCallback：: requestIdleCallback 是一个用于在浏览器空闲时执行指定的回调函数的方法。它通常用于执行一些低优先级的任务，以确保不会影响到页面的交互和动画性能。

调用时机：requestIdleCallback 的回调函数会在浏览器空闲时执行，即在浏览器没有其他任务需要执行时，会尽快执行注册的回调函数。

用途：requestIdleCallback 适用于执行一些低优先级的任务，如执行分析、预加载资源、后台数据同步等。

13. react 中组件销毁时会自动回收 ref 么？

在 React 中，组件销毁时并不会自动回收 ref。ref 是一个特殊的属性，用于引用组件实例或 DOM 元素，在组件销毁时，ref 引用的对象并不会自动被销毁，而是需要手动进行清理操作。

14. 以下代码的输出结果是什么？

async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}

async function async2() {
  console.log("async2");
}

console.log("script start");

setTimeout(function () {
  console.log("setTimeout");
}, 0);

async1();

new Promise(function (resolve) {
  console.log("promise1");
  resolve();
}).then(function () {
  console.log("promise2");
});

console.log("script end");
answer:

"script start";
"async1 start";
"async2";
"promise1";
"script end";
"async1 end";
"promise2";
"setTimeout";
15. 按要求实现以下功能：

实现前端一个并发请求控制函数 1. 输入URL数组 和 限制请求数 2. 按照 限制请求数 控制前端同时可以并发请求数量 3. 请求操作直接用 window.fetch

Answer:

// Example usage
const urls = [
    'https://api.example.com/data1',
    'https://api.example.com/data2',
    'https://api.example.com/data3',
    // Add more URLs as needed
];

const limit = 2;

async function concurrentRequests(urls, limit) {
    const results = [];
    const inFlightRequests = [];

    async function makeRequest(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            results.push(data);
        } catch (error) {
            results.push({ error: error.message });
        }
    }

    for (let i = 0; i < urls.length; i++) {
        const request = makeRequest(urls[i]);
        inFlightRequests.push(request);

        if (inFlightRequests.length === limit || i === urls.length - 1) {
            await Promise.all(inFlightRequests);
            inFlightRequests.length = 0;
        }
    }

    return results;
}

concurrentRequests(urls, limit)
    .then(results => console.log(results))
    .catch(error => console.error(error));

## zoom 二面
结合项目进行讨论，需要准备一下项目中可能会拓展的技术点。