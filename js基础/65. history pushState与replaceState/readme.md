### popstate 事件

* 调用 history.pushState() 或者 history.replaceState() 不会触发 popstate 事件。 
* popstate事件只会在浏览器某些行为下触发， 比如点击后退、前进按钮(或者在JavaScript中调用 history.back()、history.forward()、history.go()方法)


### 参考资料
* [简单聊聊H5的pushState与replaceState](https://juejin.cn/post/6844903558576341000)