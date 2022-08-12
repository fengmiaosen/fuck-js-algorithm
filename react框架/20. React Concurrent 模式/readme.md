### Concurrent Mode是什么?

一句话概括：
Concurrent 模式是一组 React 的新功能，可帮助应用保持响应，并根据用户的设备性能和网速进行适当的调整。


### react 三种模式

* legacy 模式： 
ReactDOM.render(<App />, rootNode)。这是当前 React app 使用的方式。当前没有计划删除本模式，但是这个模式可能不支持这些新功能。

* blocking 模式： 
ReactDOM.createBlockingRoot(rootNode).render(<App />)。目前正在实验中。作为迁移到 concurrent 模式的第一个步骤。

* concurrent 模式： 
ReactDOM.createRoot(rootNode).render(<App />)。目前在实验中，未来稳定之后，打算作为 React 的默认开发模式。这个模式开启了所有的新功能。


### 参考资料

* [使用 Concurrent 模式](https://zh-hans.reactjs.org/docs/concurrent-mode-adoption.html)
* [什么是 React Concurrent Mode](https://www.teqng.com/2021/11/10/%E4%BB%80%E4%B9%88%E6%98%AF-react-concurrent-mode%EF%BC%9F%E3%80%90react%E6%9E%B6%E6%9E%84%E7%9A%84%E5%89%8D%E4%B8%96%E4%BB%8A%E7%94%9F%EF%BC%81%EF%BC%81%EF%BC%81%E3%80%91/)
* [react源码解析6.legacy模式和concurrent模式](https://segmentfault.com/a/1190000041398757)