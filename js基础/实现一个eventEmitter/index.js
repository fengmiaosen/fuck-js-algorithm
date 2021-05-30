// https://juejin.cn/post/6844904009761816584
// https://zhuanlan.zhihu.com/p/77876876

class EventEmitter {
  constructor() {
    this.events = {}
    this.maxEvents = 100
  }

  on(type, fn) {
    if (this.events[type]) {
      this.events[type].push(fn)
    } else {
      this.events[type] = [fn]
    }
  }

  once(type, fn) {

    this.on(type, (...args) => {
      fn.apply(this, args)
      this.off(type, fn)
    })
  }

  off(type, fn) {
    if (this.events[type]) {
      if (fn) {
        const idx = this.events[type].findIndex(item => item === fn)
        this.events[type].splice(idx, 1)
      } else {
        this.events[type] = []
      }
    }
  }

  /**
   * 
   * @param {string} type 
   * @param  {...any} args 
   */
  emit(type, ...args) {
    if (this.events[type]) {
      for(let fn of this.events[type]){
        fn.apply(this, args)
      }
    }
  }

}

// 运行示例
const eventEmitter = new EventEmitter();

eventEmitter.on('say', function (str) {
  console.log(str);
});

eventEmitter.once('say11', function (str) {
  console.log('这是once 1:' + str)
})

// console.log('events:', eventEmitter.events)

eventEmitter.emit('say', 'visa');
eventEmitter.emit('say', 'visa222');

eventEmitter.emit('say11', 'visa11');
eventEmitter.emit('say11', 'visa11-22');
