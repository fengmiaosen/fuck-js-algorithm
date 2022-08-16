// 参考
// https://github.com/sisterAn/JavaScript-Algorithms/issues/106
// https://juejin.cn/post/6860646761392930830

// 需要按照 a,b,延迟1秒,c,延迟1秒,d,e, done 的顺序打印
// 按照上面的测试用例，实现 createFlow：
// flow 是指一系列 effects 组成的逻辑片段。
// flow 支持嵌套。
// effects 的执行只需要支持串行。

class Flow {
  /**
   * 
   * @param {array} effects 
   */
  constructor(effects) {
    this.queue = [...effects.flat()]
  }
  
  async run(cb) {
    for (let task of this.queue) {
      if (task instanceof Flow) {
        await task.run()
      } else {
        await task()
      }
    }
    if (cb) cb()
  }
};

function createFlow(effects = []) {
  return new Flow(effects)
}


// 测试
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const subFlow = createFlow([() => delay(1000).then(() => console.log("c"))]);

createFlow([
  () => console.log("a"),
  () => console.log("b"),
  subFlow,
  [() => delay(1000).then(() => console.log("d")), () => console.log("e")],
]).run(() => {
  console.log("done");
});
// a,b,延迟1秒,c,延迟1秒,d,e, done 的顺序打印

