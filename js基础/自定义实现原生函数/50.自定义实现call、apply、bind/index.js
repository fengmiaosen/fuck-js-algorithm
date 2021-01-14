// https://www.cnblogs.com/echolun/p/12144344.html

//  自定义实现call
// 将当前函数对象 this 挂载到 context的某个临时属性上，然后调用，这样就改变了当前函数的this指向
// 调用完毕将临时属性删除，返回执行结果
Function.prototype.callFn = function (context, ...args) {

    context = context ? Object(context) : window

    context.fn = this
    const res = context.fn(...args)
    delete context.fn

    return res
}

Function.prototype.applyFn = function (context, args) {

    context = context ? Object(context) : window
    context.fn = this

    const res = args ? context.fn(...args) : context.fn()
    delete context.fn

    return res
}

let obj = {
    name: 'obj-name'
}

function getData(args){
    console.log(args)
    return this.name
}

console.log(getData.callFn(obj, 'ggg'))
console.log(getData.applyFn(obj, ['ggg']))