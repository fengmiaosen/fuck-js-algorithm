// 箭头函数与普通函数（function）的区别是什么？
// 构造函数（function）可以使用 new 生成实例，那么箭头函数可以吗？为什么？

console.log('=== 箭头函数与普通函数的区别 ===\n');

// 1. this 绑定的区别
console.log('1. this 绑定的区别:');

const obj = {
  name: 'Object',
  
  // 普通函数
  regularFunction: function() {
    console.log('普通函数 this.name:', this.name);
    return this;
  },
  
  // 箭头函数
  arrowFunction: () => {
    console.log('箭头函数 this.name:', this.name);
    return this;
  },
  
  // 嵌套函数中的 this
  nestedExample: function() {
    console.log('外层普通函数 this.name:', this.name);
    
    // 普通函数内的普通函数
    function innerRegular() {
      console.log('内层普通函数 this.name:', this.name); // undefined (严格模式) 或 window.name
    }
    
    // 普通函数内的箭头函数
    const innerArrow = () => {
      console.log('内层箭头函数 this.name:', this.name); // 继承外层的 this
    };
    
    innerRegular();
    innerArrow();
  }
};

obj.regularFunction();
obj.arrowFunction();
obj.nestedExample();

console.log('\n');

// 2. 构造函数的区别
console.log('2. 构造函数的区别:');

// 普通函数可以作为构造函数
function RegularConstructor(name) {
  this.name = name;
  this.sayHello = function() {
    return `Hello, I'm ${this.name}`;
  };
}

// 箭头函数不能作为构造函数
const ArrowConstructor = (name) => {
  this.name = name;
};

try {
  const regular = new RegularConstructor('Regular');
  console.log('普通函数构造实例:', regular.sayHello());
} catch (error) {
  console.log('普通函数构造失败:', error.message);
}

try {
  const arrow = new ArrowConstructor('Arrow');
  console.log('箭头函数构造实例:', arrow);
} catch (error) {
  console.log('箭头函数构造失败:', error.message);
}

console.log('\n');

// 3. arguments 对象的区别
console.log('3. arguments 对象的区别:');

function regularWithArguments() {
  console.log('普通函数 arguments:', Array.from(arguments));
  console.log('普通函数 arguments.length:', arguments.length);
}

const arrowWithArguments = (...args) => {
  // console.log('箭头函数 arguments:', arguments); // 会报错：arguments is not defined
  console.log('箭头函数使用剩余参数 args:', args);
  console.log('箭头函数 args.length:', args.length);
};

regularWithArguments(1, 2, 3, 'test');
arrowWithArguments(1, 2, 3, 'test');

console.log('\n');

// 4. 原型属性的区别
console.log('4. 原型属性的区别:');

function RegularFunc() {}
const ArrowFunc = () => {};

console.log('普通函数有 prototype:', 'prototype' in RegularFunc);
console.log('普通函数 prototype:', RegularFunc.prototype);
console.log('箭头函数有 prototype:', 'prototype' in ArrowFunc);
console.log('箭头函数 prototype:', ArrowFunc.prototype);

console.log('\n');

// 5. call、apply、bind 的区别
console.log('5. call、apply、bind 的区别:');

const context = { name: 'Context Object' };

function regularFunc() {
  return `普通函数 this.name: ${this.name}`;
}

const arrowFunc = () => {
  return `箭头函数 this.name: ${this.name}`;
};

console.log('普通函数直接调用:', regularFunc());
console.log('普通函数 call 调用:', regularFunc.call(context));
console.log('普通函数 apply 调用:', regularFunc.apply(context));
console.log('普通函数 bind 调用:', regularFunc.bind(context)());

console.log('箭头函数直接调用:', arrowFunc());
console.log('箭头函数 call 调用:', arrowFunc.call(context));
console.log('箭头函数 apply 调用:', arrowFunc.apply(context));
console.log('箭头函数 bind 调用:', arrowFunc.bind(context)());

console.log('\n');

// 6. 变量提升的区别
console.log('6. 变量提升的区别:');

console.log('普通函数声明会提升:', typeof hoistedFunction);
console.log('箭头函数变量不会提升:', typeof arrowVariable);

// 普通函数声明
function hoistedFunction() {
  return 'I am hoisted!';
}

// 箭头函数表达式
var arrowVariable = () => {
  return 'I am not hoisted!';
};

console.log('调用提升的普通函数:', hoistedFunction());
console.log('调用箭头函数变量:', arrowVariable());

console.log('\n');

// 7. 性能对比
console.log('7. 性能对比:');

const iterations = 1000000;

// 普通函数性能测试
console.time('普通函数性能');
for (let i = 0; i < iterations; i++) {
  (function(x) { return x * 2; })(i);
}
console.timeEnd('普通函数性能');

// 箭头函数性能测试
console.time('箭头函数性能');
for (let i = 0; i < iterations; i++) {
  ((x) => x * 2)(i);
}
console.timeEnd('箭头函数性能');

console.log('\n');

// 8. 实际应用场景对比
console.log('8. 实际应用场景对比:');

// 事件处理器中的 this
class EventHandler {
  constructor(name) {
    this.name = name;
  }
  
  // 普通方法 - this 会丢失
  regularHandler() {
    console.log(`普通方法处理事件: ${this.name}`);
  }
  
  // 箭头函数方法 - this 绑定正确
  arrowHandler = () => {
    console.log(`箭头函数处理事件: ${this.name}`);
  }
  
  setupHandlers() {
    // 模拟事件绑定
    setTimeout(this.regularHandler, 100); // this 丢失
    setTimeout(this.arrowHandler, 200);   // this 正确
    
    // 使用 bind 修复普通函数
    setTimeout(this.regularHandler.bind(this), 300);
  }
}

const handler = new EventHandler('MyHandler');
handler.setupHandlers();

// 数组方法中的应用
const numbers = [1, 2, 3, 4, 5];

// 箭头函数在数组方法中的简洁性
const doubled = numbers.map(n => n * 2);
const filtered = numbers.filter(n => n > 2);
const sum = numbers.reduce((acc, n) => acc + n, 0);

console.log('数组处理结果:');
console.log('原数组:', numbers);
console.log('翻倍:', doubled);
console.log('过滤:', filtered);
console.log('求和:', sum);

console.log('\n');

// 总结
console.log('=== 总结 ===');
console.log('箭头函数与普通函数的主要区别:');
console.log('1. this 绑定: 箭头函数继承外层作用域的 this，普通函数的 this 取决于调用方式');
console.log('2. 构造函数: 箭头函数不能用作构造函数，普通函数可以');
console.log('3. arguments: 箭头函数没有 arguments 对象，需要使用剩余参数');
console.log('4. 原型: 箭头函数没有 prototype 属性');
console.log('5. 绑定方法: call/apply/bind 对箭头函数无效');
console.log('6. 提升: 函数声明会提升，箭头函数表达式不会');
console.log('7. 语法: 箭头函数语法更简洁，适合简单的函数表达式');
console.log('8. 性能: 在某些场景下箭头函数可能有轻微的性能优势');

console.log('\n使用建议:');
console.log('- 需要动态 this 绑定时使用普通函数');
console.log('- 需要构造函数时使用普通函数');
console.log('- 简单的函数表达式、回调函数使用箭头函数');
console.log('- 类方法中需要绑定 this 时使用箭头函数');
