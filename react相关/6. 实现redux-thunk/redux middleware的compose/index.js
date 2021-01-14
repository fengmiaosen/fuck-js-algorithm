// https://cn.redux.js.org/docs/api/compose.html
// 从右到左来组合多个函数。
// 这是函数式编程中的方法，为了方便，被放到了 Redux 里。
// 当需要把多个 store 增强器 依次执行的时候，需要用到它
// compose(funcA, funcB, funcC) 形象为 compose(funcA(funcB(funcC())))

function compose(...funcs) {

    if (funcs.length === 0) {
        return arg => arg;
    }

    if (funcs.length === 1) {
        return funcs[0];
    }

    return funcs.reduce((a, b) =>
        (...args) => a(b(...args))
    );
}

