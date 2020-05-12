class Routers {
    constructor() {
      this.routes = {};
      // 在初始化时监听popstate事件
      this._bindPopState();
    }
    // 初始化路由
    init(path) {
      history.replaceState({path: path}, null, path);
      this.routes[path] && this.routes[path]();
    }
    // 将路径和对应回调函数加入hashMap储存
    route(path, callback) {
      this.routes[path] = callback || function() {};
    }
  
    // 触发路由对应回调
    go(path) {
      history.pushState({path: path}, null, path);
      this.routes[path] && this.routes[path]();
    }
    // 后退
    backOff(){
      history.back()
    }
    // 监听popstate事件
    _bindPopState() {
      window.addEventListener('popstate', e => {
        const path = e.state && e.state.path;
        this.routes[path] && this.routes[path]();
      });
    }
  }