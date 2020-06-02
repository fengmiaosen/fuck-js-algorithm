
// finally中的代码最终也会在try或catch block显式返回 return 时执行。
function test() {
    try {
        console.log(1);

        return 'from_try';

    } catch (e) {
        // TODO
    } finally {

        console.log(2);
    }
}

console.log('test1 =======');
console.log(test()); // 1 2 from_try

function test2() {
    try {
        console.log(1);
        return 'from_try';
    } catch (e) {
        // TODO
    } finally {
        console.log(2);
        return 'from_finally';
    }
}

console.log('test2 =======');
console.log(test2()); // 1 2 from_finally

function test3() {
    try {
        console.log(1);
        throw new Error('throw error!!!');
    } catch (e) {
        console.log(e.message);
        return 'from_catch';
    } finally {
        console.log(2);
    }
}

console.log('test3 ======');
console.log(test3()); // 1 throw 2 from_catch