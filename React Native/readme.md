# React Native 面试核心要点

## 目录
1. [基础概念和架构原理](#1-基础概念和架构原理)
2. [核心组件和 API](#2-核心组件和-api)
3. [性能优化](#3-性能优化)
4. [调试和开发工具](#4-调试和开发工具)
5. [原生模块开发](#5-原生模块开发)
6. [状态管理](#6-状态管理)
7. [导航和路由](#7-导航和路由)
8. [常见面试题](#8-常见面试题)
9. [实战经验](#9-实战经验)

## 1. 基础概念和架构原理

### 1.1 React Native 是什么？

```javascript
// React Native 的核理念
const ReactNativeCore = {
  concept: "Learn once, write anywhere",
  architecture: "JavaScript + Native Bridge",
  rendering: "Native components, not WebView",
  performance: "Near-native performance"
};

// 与其他跨端方案的区别
const CrossPlatformComparison = {
  reactNative: {
    rendering: "Native components",
    performance: "High",
    codeReuse: "~80-90%",
    learningCurve: "Medium"
  },
  flutter: {
    rendering: "Custom rendering engine",
    performance: "Very High",
    codeReuse: "~95%",
    learningCurve: "High"
  },
  ionic: {
    rendering: "WebView",
    performance: "Medium",
    codeReuse: "~95%",
    learningCurve: "Low"
  }
};
```

### 1.2 架构原理

#### JavaScript Bridge
```javascript
// React Native 架构的三个主要部分
const RNArchitecture = {
  javascriptThread: {
    description: "运行 React 代码和业务逻辑",
    responsibilities: [
      "执行 JavaScript 代码",
      "处理用户交互逻辑",
      "管理应用状态",
      "调用原生模块"
    ]
  },
  
  nativeThread: {
    description: "处理 UI 渲染和原生功能",
    responsibilities: [
      "UI 组件渲染",
      "处理原生事件",
      "访问设备 API",
      "执行原生代码"
    ]
  },
  
  bridge: {
    description: "连接 JavaScript 和原生代码",
    mechanism: "异步消息传递",
    serialization: "JSON",
    batching: "批量处理提高性能"
  }
};

// Bridge 通信示例
class BridgeCommunication {
  // JavaScript 调用原生方法
  static callNativeMethod() {
    NativeModules.MyNativeModule.processData({
      data: "example",
      callback: (result) => {
        console.log("Native result:", result);
      }
    });
  }
  
  // 原生回调 JavaScript
  static handleNativeCallback(data) {
    // 处理来自原生的数据
    this.updateUI(data);
  }
}
```

#### 新架构 (Fabric + TurboModules)
```javascript
// React Native 新架构特性
const NewArchitecture = {
  fabric: {
    description: "新的 UI 渲染系统",
    benefits: [
      "同步渲染",
      "更好的性能",
      "类型安全",
      "更小的包体积"
    ]
  },
  
  turboModules: {
    description: "新的原生模块系统",
    benefits: [
      "懒加载",
      "类型安全",
      "更好的性能",
      "JSI (JavaScript Interface) 直接调用"
    ]
  },
  
  codegen: {
    description: "代码生成工具",
    purpose: "自动生成类型安全的接口代码"
  }
};
```

### 1.3 生命周期

```javascript
// React Native 组件生命周期
class LifecycleExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
    console.log("1. Constructor");
  }
  
  componentDidMount() {
    console.log("2. ComponentDidMount");
    // 适合进行 API 调用、订阅事件
    this.fetchData();
    this.setupEventListeners();
  }
  
  componentDidUpdate(prevProps, prevState) {
    console.log("3. ComponentDidUpdate");
    // 响应 props 或 state 变化
    if (prevProps.userId !== this.props.userId) {
      this.fetchData();
    }
  }
  
  componentWillUnmount() {
    console.log("4. ComponentWillUnmount");
    // 清理工作：取消订阅、清除定时器
    this.cleanup();
  }
  
  // 使用 Hooks 的现代写法
  static functionalComponent() {
    const [data, setData] = useState(null);
    
    useEffect(() => {
      // componentDidMount + componentDidUpdate
      fetchData().then(setData);
      
      return () => {
        // componentWillUnmount
        cleanup();
      };
    }, []); // 空依赖数组 = componentDidMount
    
    useEffect(() => {
      // 监听特定值变化
      updateSomething();
    }, [data]); // 依赖 data
  }
}
```

## 2. 核心组件和 API

### 2.1 基础组件

```javascript
import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

// 核心组件使用示例
const CoreComponents = () => {
  const [text, setText] = useState('');
  const [data, setData] = useState([]);
  
  return (
    <ScrollView style={styles.container}>
      {/* 基础容器 */}
      <View style={styles.section}>
        <Text style={styles.title}>基础组件示例</Text>
        
        {/* 图片组件 */}
        <Image 
          source={{ uri: 'https://example.com/image.jpg' }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* 输入框 */}
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="请输入内容"
          multiline={false}
          secureTextEntry={false}
        />
        
        {/* 可点击组件 */}
        <TouchableOpacity 
          style={styles.button}
          onPress={() => console.log('Button pressed')}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>点击按钮</Text>
        </TouchableOpacity>
      </View>
      
      {/* 列表组件 */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.title}</Text>
          </View>
        )}
        onEndReached={() => {
          // 加载更多数据
          loadMoreData();
        }}
        onEndReachedThreshold={0.1}
        refreshing={false}
        onRefresh={() => {
          // 下拉刷新
          refreshData();
        }}
      />
    </ScrollView>
  );
};
```

### 2.2 样式系统

```javascript
// React Native 样式系统
const StyleSystem = {
  // Flexbox 布局（默认）
  flexboxDefaults: {
    flexDirection: 'column', // 默认垂直布局
    alignItems: 'stretch',   // 默认拉伸
    justifyContent: 'flex-start'
  },
  
  // 样式定义方式
  styleDefinition: {
    inline: { flex: 1, backgroundColor: 'red' },
    stylesheet: StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff'
      }
    }),
    array: [styles.base, styles.modifier, { color: 'blue' }]
  }
};

// 响应式设计
import { Dimensions, PixelRatio } from 'react-native';

const ResponsiveDesign = {
  // 获取屏幕尺寸
  getScreenDimensions() {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  },
  
  // 像素密度适配
  getPixelSize(size) {
    return PixelRatio.getPixelSizeForLayoutSize(size);
  },
  
  // 响应式字体大小
  responsiveFontSize(size) {
    const { width } = Dimensions.get('window');
    const scale = width / 375; // 以 iPhone 6 为基准
    return Math.round(PixelRatio.roundToNearestPixel(size * scale));
  }
};

// 样式最佳实践
const styles = StyleSheet.create({
  // 使用 flex 布局
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20
  },
  
  // 避免使用绝对定位
  absolutePosition: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  
  // 使用相对单位
  responsiveText: {
    fontSize: ResponsiveDesign.responsiveFontSize(16),
    lineHeight: ResponsiveDesign.responsiveFontSize(24)
  }
});
```

### 2.3 平台特定代码

```javascript
// 平台检测和特定代码
import { Platform } from 'react-native';

const PlatformSpecific = {
  // 平台检测
  checkPlatform() {
    if (Platform.OS === 'ios') {
      return 'iOS 平台';
    } else if (Platform.OS === 'android') {
      return 'Android 平台';
    }
  },
  
  // 平台特定样式
  platformStyles: StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.OS === 'ios' ? 44 : 0, // iOS 状态栏
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84
        },
        android: {
          elevation: 5
        }
      })
    }
  }),
  
  // 平台特定组件
  PlatformComponent: Platform.select({
    ios: () => require('./IOSComponent'),
    android: () => require('./AndroidComponent')
  })()
};

// 文件命名约定
// MyComponent.ios.js  - iOS 特定
// MyComponent.android.js  - Android 特定
// MyComponent.js  - 通用组件
```

## 3. 性能优化

### 3.1 渲染性能优化

```javascript
// 1. 使用 React.memo 避免不必要的重渲染
const OptimizedComponent = React.memo(({ data, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{data.title}</Text>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // 自定义比较函数
  return prevProps.data.id === nextProps.data.id;
});

// 2. 使用 useMemo 和 useCallback
const PerformanceOptimization = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  
  // 缓存计算结果
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);
  
  // 缓存回调函数
  const handleItemPress = useCallback((item) => {
    console.log('Item pressed:', item);
  }, []);
  
  return (
    <FlatList
      data={filteredItems}
      renderItem={({ item }) => (
        <OptimizedComponent 
          data={item} 
          onPress={() => handleItemPress(item)}
        />
      )}
      keyExtractor={(item) => item.id}
      // 性能优化配置
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={10}
      getItemLayout={(data, index) => ({
        length: 80,
        offset: 80 * index,
        index
      })}
    />
  );
};

// 3. 图片优化
const ImageOptimization = {
  // 使用合适的图片格式和尺寸
  optimizedImage: (
    <Image
      source={{ uri: 'https://example.com/image.jpg' }}
      style={{ width: 200, height: 200 }}
      resizeMode="cover"
      // 缓存策略
      cache="force-cache"
      // 加载占位符
      defaultSource={require('./placeholder.png')}
      // 加载指示器
      loadingIndicatorSource={require('./loading.gif')}
    />
  ),
  
  // 使用 FastImage 库（第三方）
  fastImage: (
    <FastImage
      style={{ width: 200, height: 200 }}
      source={{
        uri: 'https://example.com/image.jpg',
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.immutable
      }}
      resizeMode={FastImage.resizeMode.cover}
    />
  )
};
```

### 3.2 内存管理

```javascript
// 内存泄漏预防
class MemoryManagement extends React.Component {
  constructor(props) {
    super(props);
    this.timers = [];
    this.subscriptions = [];
  }
  
  componentDidMount() {
    // 正确管理定时器
    const timer = setInterval(() => {
      this.updateData();
    }, 1000);
    this.timers.push(timer);
    
    // 正确管理事件监听
    const subscription = DeviceEventEmitter.addListener(
      'customEvent',
      this.handleCustomEvent
    );
    this.subscriptions.push(subscription);
  }
  
  componentWillUnmount() {
    // 清理定时器
    this.timers.forEach(timer => clearInterval(timer));
    this.timers = [];
    
    // 清理事件监听
    this.subscriptions.forEach(subscription => subscription.remove());
    this.subscriptions = [];
  }
  
  handleCustomEvent = (data) => {
    // 使用箭头函数避免 this 绑定问题
    this.setState({ data });
  }
}

// 使用 Hooks 的内存管理
const MemoryManagementHooks = () => {
  useEffect(() => {
    const timer = setInterval(() => {
      updateData();
    }, 1000);
    
    const subscription = DeviceEventEmitter.addListener(
      'customEvent',
      handleCustomEvent
    );
    
    // 清理函数
    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, []);
};
```

### 3.3 Bundle 大小优化

```javascript
// 1. 代码分割和懒加载
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

const CodeSplitting = () => {
  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <LazyComponent />
    </Suspense>
  );
};

// 2. 条件导入
const ConditionalImport = {
  async loadPlatformSpecificModule() {
    if (Platform.OS === 'ios') {
      const module = await import('./ios/SpecificModule');
      return module.default;
    } else {
      const module = await import('./android/SpecificModule');
      return module.default;
    }
  }
};

// 3. 移除未使用的代码
// 使用 metro-config 配置 tree shaking
module.exports = {
  transformer: {
    minifierConfig: {
      keep_fnames: true,
      mangle: {
        keep_fnames: true
      }
    }
  }
};
```

## 4. 调试和开发工具

### 4.1 调试工具

```javascript
// 1. React Native Debugger
const DebuggingTools = {
  // 开启调试模式
  enableDebugging() {
    if (__DEV__) {
      // 开启网络请求监控
      XMLHttpRequest = GLOBAL.originalXMLHttpRequest || XMLHttpRequest;
      
      // 开启 Redux DevTools
      const store = createStore(
        rootReducer,
        composeWithDevTools(applyMiddleware(thunk))
      );
    }
  },
  
  // 性能监控
  performanceMonitoring() {
    // 使用 Flipper 进行性能分析
    console.log('Performance monitoring enabled');
  }
};

// 2. 日志管理
class Logger {
  static log(message, data = null) {
    if (__DEV__) {
      console.log(`[${new Date().toISOString()}] ${message}`, data);
    }
  }
  
  static error(message, error = null) {
    if (__DEV__) {
      console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error);
    }
    // 生产环境发送到错误监控服务
    if (!__DEV__) {
      crashlytics().recordError(error);
    }
  }
  
  static performance(label, fn) {
    if (__DEV__) {
      console.time(label);
      const result = fn();
      console.timeEnd(label);
      return result;
    }
    return fn();
  }
}

// 3. 网络请求调试
const NetworkDebugging = {
  // 拦截网络请求
  setupNetworkInterceptor() {
    const originalFetch = global.fetch;
    global.fetch = async (url, options) => {
      console.log('Request:', url, options);
      const response = await originalFetch(url, options);
      console.log('Response:', response.status, response.statusText);
      return response;
    };
  }
};
```

### 4.2 错误处理

```javascript
// 1. 错误边界
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    // 记录错误信息
    Logger.error('Error Boundary caught an error', {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack
    });
    
    // 发送错误报告
    crashlytics().recordError(error);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Something went wrong. Please try again.
          </Text>
          <TouchableOpacity 
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return this.props.children;
  }
}

// 2. 全局错误处理
const GlobalErrorHandler = {
  setup() {
    // 处理未捕获的 Promise 拒绝
    const originalHandler = global.onunhandledrejection;
    global.onunhandledrejection = (event) => {
      Logger.error('Unhandled Promise Rejection', event.reason);
      if (originalHandler) {
        originalHandler(event);
      }
    };
    
    // 处理 JavaScript 错误
    ErrorUtils.setGlobalHandler((error, isFatal) => {
      Logger.error('Global JavaScript Error', { error, isFatal });
      if (isFatal) {
        // 重启应用或显示错误页面
        this.handleFatalError(error);
      }
    });
  },
  
  handleFatalError(error) {
    // 显示用户友好的错误信息
    Alert.alert(
      'Application Error',
      'The application has encountered an error and needs to restart.',
      [{ text: 'Restart', onPress: () => RNRestart.Restart() }]
    );
  }
};
```

## 5. 原生模块开发

### 5.1 iOS 原生模块

```objective-c
// iOS 原生模块示例 (Objective-C)
// MyNativeModule.h
#import <React/RCTBridgeModule.h>

@interface MyNativeModule : NSObject <RCTBridgeModule>
@end

// MyNativeModule.m
#import "MyNativeModule.h"
#import <React/RCTLog.h>

@implementation MyNativeModule

RCT_EXPORT_MODULE();

// 导出同步方法
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getDeviceInfo) {
  return @{
    @"model": [[UIDevice currentDevice] model],
    @"systemVersion": [[UIDevice currentDevice] systemVersion]
  };
}

// 导出异步方法
RCT_EXPORT_METHOD(processData:(NSString *)input
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  if (input.length == 0) {
    reject(@"invalid_input", @"Input cannot be empty", nil);
    return;
  }
  
  // 异步处理
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    NSString *result = [self processInputData:input];
    resolve(result);
  });
}

// 导出常量
- (NSDictionary *)constantsToExport {
  return @{
    @"API_URL": @"https://api.example.com",
    @"VERSION": @"1.0.0"
  };
}

@end
```

### 5.2 Android 原生模块

```java
// Android 原生模块示例 (Java)
// MyNativeModule.java
package com.myapp.nativemodules;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

public class MyNativeModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "MyNativeModule";
    
    public MyNativeModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    
    @Override
    public String getName() {
        return MODULE_NAME;
    }
    
    // 导出异步方法
    @ReactMethod
    public void processData(String input, Promise promise) {
        try {
            if (input == null || input.isEmpty()) {
                promise.reject("invalid_input", "Input cannot be empty");
                return;
            }
            
            // 异步处理
            new Thread(() -> {
                String result = processInputData(input);
                WritableMap response = Arguments.createMap();
                response.putString("result", result);
                promise.resolve(response);
            }).start();
            
        } catch (Exception e) {
            promise.reject("processing_error", e.getMessage());
        }
    }
    
    // 导出常量
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("API_URL", "https://api.example.com");
        constants.put("VERSION", "1.0.0");
        return constants;
    }
}

// MyNativePackage.java
package com.myapp.nativemodules;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MyNativePackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new MyNativeModule(reactContext));
        return modules;
    }
    
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
```

### 5.3 JavaScript 调用原生模块

```javascript
// JavaScript 端调用原生模块
import { NativeModules } from 'react-native';

const { MyNativeModule } = NativeModules;

class NativeModuleUsage {
  // 调用异步方法
  static async processData(input) {
    try {
      const result = await MyNativeModule.processData(input);
      console.log('Native processing result:', result);
      return result;
    } catch (error) {
      console.error('Native module error:', error);
      throw error;
    }
  }
  
  // 获取常量
  static getConstants() {
    const constants = MyNativeModule.getConstants();
    console.log('Native constants:', constants);
    return constants;
  }
  
  // 同步方法调用（iOS）
  static getDeviceInfo() {
    if (Platform.OS === 'ios') {
      return MyNativeModule.getDeviceInfo();
    }
    return null;
  }
}

// 使用示例
const ExampleUsage = () => {
  const [result, setResult] = useState(null);
  
  const handleProcessData = async () => {
    try {
      const data = await NativeModuleUsage.processData('test input');
      setResult(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  
  return (
    <View>
      <TouchableOpacity onPress={handleProcessData}>
        <Text>Process Data</Text>
      </TouchableOpacity>
      {result && <Text>{JSON.stringify(result)}</Text>}
    </View>
  );
};
```

## 6. 状态管理

### 6.1 Context API

```javascript
// 使用 Context API 进行状态管理
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(false);
  
  const login = async (credentials) => {
    setLoading(true);
    try {
      const userData = await authService.login(credentials);
      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    authService.logout();
  };
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const value = {
    user,
    theme,
    loading,
    login,
    logout,
    toggleTheme
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// 自定义 Hook
const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// 使用示例
const LoginScreen = () => {
  const { login, loading } = useApp();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  
  const handleLogin = async () => {
    try {
      await login(credentials);
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };
  
  return (
    <View>
      <TextInput
        value={credentials.email}
        onChangeText={(email) => setCredentials(prev => ({ ...prev, email }))}
        placeholder="Email"
      />
      <TextInput
        value={credentials.password}
        onChangeText={(password) => setCredentials(prev => ({ ...prev, password }))}
        placeholder="Password"
        secureTextEntry
      />
      <TouchableOpacity onPress={handleLogin} disabled={loading}>
        <Text>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### 6.2 Redux 集成

```javascript
// Redux 状态管理
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider, useSelector, useDispatch } from 'react-redux';

// Actions
const ActionTypes = {
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

const setUser = (user) => ({ type: ActionTypes.SET_USER, payload: user });
const setLoading = (loading) => ({ type: ActionTypes.SET_LOADING, payload: loading });
const setError = (error) => ({ type: ActionTypes.SET_ERROR, payload: error });

// Async Actions
const loginUser = (credentials) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  
  try {
    const user = await authService.login(credentials);
    dispatch(setUser(user));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

// Reducers
const userReducer = (state = { user: null, loading: false, error: null }, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return { ...state, user: action.payload };
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: userReducer
});

// Store
const store = createStore(rootReducer, applyMiddleware(thunk));

// App 组件
const App = () => (
  <Provider store={store}>
    <AppNavigator />
  </Provider>
);

// 使用 Redux 的组件
const LoginScreen = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.user);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  
  const handleLogin = () => {
    dispatch(loginUser(credentials));
  };
  
  if (user) {
    return <HomeScreen />;
  }
  
  return (
    <View>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        value={credentials.email}
        onChangeText={(email) => setCredentials(prev => ({ ...prev, email }))}
        placeholder="Email"
      />
      <TextInput
        value={credentials.password}
        onChangeText={(password) => setCredentials(prev => ({ ...prev, password }))}
        placeholder="Password"
        secureTextEntry
      />
      <TouchableOpacity onPress={handleLogin} disabled={loading}>
        <Text>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>
    </View>
  );
};
```

## 7. 导航和路由

### 7.1 React Navigation

```javascript
// React Navigation 5/6 使用示例
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// 堆栈导航
const AuthStack = () => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={{
      headerStyle: { backgroundColor: '#6200ee' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' }
    }}
  >
    <Stack.Screen 
      name="Login" 
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="Register" 
      component={RegisterScreen}
      options={{ title: 'Create Account' }}
    />
  </Stack.Navigator>
);

// 标签导航
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#6200ee',
      tabBarInactiveTintColor: 'gray'
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// 抽屉导航
const DrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName="Main"
    drawerContent={(props) => <CustomDrawerContent {...props} />}
  >
    <Drawer.Screen name="Main" component={MainTabs} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
  </Drawer.Navigator>
);

// 主导航容器
const AppNavigator = () => {
  const { user } = useApp();
  
  return (
    <NavigationContainer>
      {user ? <DrawerNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

// 导航操作
const NavigationActions = {
  // 基础导航
  navigate: (navigation, screenName, params) => {
    navigation.navigate(screenName, params);
  },
  
  // 返回
  goBack: (navigation) => {
    navigation.goBack();
  },
  
  // 重置导航栈
  reset: (navigation, routeName) => {
    navigation.reset({
      index: 0,
      routes: [{ name: routeName }]
    });
  },
  
  // 传递参数
  navigateWithParams: (navigation, screenName, params) => {
    navigation.navigate(screenName, params);
  }
};

// 使用导航的组件
const HomeScreen = ({ navigation, route }) => {
  const params = route.params;
  
  const handleNavigateToDetail = () => {
    navigation.navigate('Detail', { 
      itemId: 123, 
      title: 'Item Title' 
    });
  };
  
  // 设置导航选项
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings" size={24} color="#fff" />
        </TouchableOpacity>
      )
    });
  }, [navigation]);
  
  return (
    <View>
      <Text>Home Screen</Text>
      <TouchableOpacity onPress={handleNavigateToDetail}>
        <Text>Go to Detail</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### 7.2 深度链接

```javascript
// 深度链接配置
const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      Home: 'home',
      Profile: 'profile/:userId',
      Detail: 'detail/:itemId',
      NotFound: '*'
    }
  }
};

// 在 NavigationContainer 中使用
const AppNavigator = () => (
  <NavigationContainer linking={linking}>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

// 处理深度链接
const DeepLinkHandler = {
  // 获取初始 URL
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    return url;
  },
  
  // 监听 URL 变化
  addListener(callback) {
    const subscription = Linking.addEventListener('url', callback);
    return subscription;
  },
  
  // 解析 URL 参数
  parseURL(url) {
    const route = url.replace(/.*?:\/\//g, '');
    const [path, queryString] = route.split('?');
    const params = new URLSearchParams(queryString);
    return { path, params };
  }
};
```

## 8. 常见面试题

### 8.1 基础概念题

```javascript
// Q1: React Native 与原生开发的区别？
const RNvsNative = {
  reactNative: {
    advantages: [
      "跨平台开发，代码复用率高",
      "开发效率高，热重载",
      "使用 JavaScript，学习成本低",
      "丰富的第三方库生态"
    ],
    disadvantages: [
      "性能略低于原生",
      "复杂动画和 UI 可能需要原生实现",
      "依赖第三方库，版本兼容性问题",
      "包体积相对较大"
    ]
  },
  native: {
    advantages: [
      "最佳性能表现",
      "完全访问平台 API",
      "更好的用户体验",
      "更稳定可靠"
    ],
    disadvantages: [
      "需要维护两套代码",
      "开发成本高",
      "需要不同技能栈",
      "发布周期长"
    ]
  }
};

// Q2: React Native 的渲染原理？
const RenderingProcess = {
  step1: "JavaScript 线程执行 React 代码",
  step2: "生成虚拟 DOM 树",
  step3: "通过 Bridge 将渲染指令发送到原生线程",
  step4: "原生线程创建对应的原生组件",
  step5: "原生组件渲染到屏幕上",
  
  // 新架构 Fabric
  newArchitecture: {
    synchronousRendering: "同步渲染，减少延迟",
    jsi: "JavaScript Interface，直接调用原生方法",
    codegeneration: "编译时生成类型安全的接口"
  }
};

// Q3: 如何优化 FlatList 性能？
const FlatListOptimization = {
  // 基础优化
  basicOptimizations: {
    keyExtractor: "提供唯一的 key",
    getItemLayout: "预定义 item 尺寸",
    removeClippedSubviews: "移除屏幕外的视图",
    maxToRenderPerBatch: "控制每批渲染数量",
    windowSize: "控制渲染窗口大小"
  },
  
  // 高级优化
  advancedOptimizations: {
    memoization: "使用 React.memo 缓存组件",
    imageOptimization: "优化图片加载和缓存",
    lazyLoading: "懒加载非关键内容",
    virtualizedList: "使用虚拟化列表"
  }
};
```

### 8.2 实战问题

```javascript
// Q4: 如何实现下拉刷新和上拉加载？
const PullToRefreshAndLoadMore = () => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  const fetchData = async (pageNum = 1, isRefresh = false) => {
    try {
      const response = await api.getData({ page: pageNum, limit: 20 });
      
      if (isRefresh) {
        setData(response.data);
        setPage(2);
      } else {
        setData(prev => [...prev, ...response.data]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(response.data.length === 20);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData(1, true);
    setRefreshing(false);
  };
  
  const handleLoadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    await fetchData(page);
    setLoading(false);
  };
  
  const renderFooter = () => {
    if (!hasMore) return <Text>No more data</Text>;
    if (loading) return <ActivityIndicator />;
    return null;
  };
  
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <ItemComponent item={item} />}
      keyExtractor={(item) => item.id}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter}
    />
  );
};

// Q5: 如何处理键盘遮挡问题？
const KeyboardHandling = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardHeight(0)
    );
    
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ paddingBottom: keyboardHeight }}>
          <TextInput placeholder="Enter text" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Q6: 如何实现图片缓存？
const ImageCaching = {
  // 使用第三方库 react-native-fast-image
  fastImageCaching: (
    <FastImage
      style={{ width: 200, height: 200 }}
      source={{
        uri: 'https://example.com/image.jpg',
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.immutable
      }}
      resizeMode={FastImage.resizeMode.cover}
    />
  ),
  
  // 自定义缓存实现
  customCaching: {
    async cacheImage(url) {
      const filename = url.split('/').pop();
      const path = `${RNFS.DocumentDirectoryPath}/${filename}`;
      
      // 检查缓存是否存在
      const exists = await RNFS.exists(path);
      if (exists) {
        return `file://${path}`;
      }
      
      // 下载并缓存
      await RNFS.downloadFile({
        fromUrl: url,
        toFile: path
      }).promise;
      
      return `file://${path}`;
    }
  }
};
```

### 8.3 架构设计题

```javascript
// Q7: 如何设计一个可扩展的 React Native 应用架构？
const AppArchitecture = {
  // 文件结构
  fileStructure: `
    src/
    ├── components/          # 通用组件
    │   ├── common/         # 基础组件
    │   └── business/       # 业务组件
    ├── screens/            # 页面组件
    ├── navigation/         # 导航配置
    ├── services/           # API 服务
    ├── store/              # 状态管理
    ├── utils/              # 工具函数
    ├── hooks/              # 自定义 Hooks
    ├── constants/          # 常量定义
    └── types/              # TypeScript 类型
  `,
  
  // 分层架构
  layeredArchitecture: {
    presentation: "UI 层 - React 组件",
    business: "业务逻辑层 - Hooks/Services",
    data: "数据层 - API/Storage",
    infrastructure: "基础设施层 - 工具/配置"
  },
  
  // 设计原则
  designPrinciples: [
    "单一职责原则",
    "依赖注入",
    "关注点分离",
    "可测试性",
    "可维护性"
  ]
};

// Q8: 如何实现离线功能？
const OfflineSupport = {
  // 网络状态检测
  networkDetection: {
    useNetInfo() {
      const [isConnected, setIsConnected] = useState(true);
      
      useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
          setIsConnected(state.isConnected);
        });
        
        return unsubscribe;
      }, []);
      
      return isConnected;
    }
  },
  
  // 数据缓存策略
  cachingStrategy: {
    // 缓存优先
    cacheFirst: async (url) => {
      const cached = await AsyncStorage.getItem(url);
      if (cached) {
        return JSON.parse(cached);
      }
      
      const response = await fetch(url);
      const data = await response.json();
      await AsyncStorage.setItem(url, JSON.stringify(data));
      return data;
    },
    
    // 网络优先
    networkFirst: async (url) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        await AsyncStorage.setItem(url, JSON.stringify(data));
        return data;
      } catch (error) {
        const cached = await AsyncStorage.getItem(url);
        if (cached) {
          return JSON.parse(cached);
        }
        throw error;
      }
    }
  },
  
  // 离线队列
  offlineQueue: {
    queue: [],
    
    addToQueue(request) {
      this.queue.push(request);
      AsyncStorage.setItem('offlineQueue', JSON.stringify(this.queue));
    },
    
    async processQueue() {
      const isConnected = await NetInfo.fetch().then(state => state.isConnected);
      if (!isConnected) return;
      
      while (this.queue.length > 0) {
        const request = this.queue.shift();
        try {
          await fetch(request.url, request.options);
        } catch (error) {
          this.queue.unshift(request); // 重新加入队列
          break;
        }
      }
      
      AsyncStorage.setItem('offlineQueue', JSON.stringify(this.queue));
    }
  }
};
```

## 9. 实战经验

### 9.1 项目配置和环境管理

```javascript
// 环境配置管理
const EnvironmentConfig = {
  // 多环境配置
  environments: {
    development: {
      API_URL: 'https://dev-api.example.com',
      DEBUG: true,
      ANALYTICS_ENABLED: false
    },
    staging: {
      API_URL: 'https://staging-api.example.com',
      DEBUG: false,
      ANALYTICS_ENABLED: true
    },
    production: {
      API_URL: 'https://api.example.com',
      DEBUG: false,
      ANALYTICS_ENABLED: true
    }
  },
  
  // 配置获取
  getConfig() {
    const env = __DEV__ ? 'development' : 'production';
    return this.environments[env];
  }
};

// Metro 配置优化
// metro.config.js
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true, // 性能优化
      },
    }),
  },
  resolver: {
    alias: {
      '@': './src', // 路径别名
      '@components': './src/components',
      '@screens': './src/screens',
      '@utils': './src/utils'
    }
  }
};

// Babel 配置
// babel.config.js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module-resolver', {
      root: ['./src'],
      alias: {
        '@': './src',
        '@components': './src/components',
        '@screens': './src/screens'
      }
    }],
    'react-native-reanimated/plugin' // 必须放在最后
  ]
};
```

### 9.2 性能监控和分析

```javascript
// 性能监控实现
class PerformanceMonitor {
  static metrics = {
    renderTimes: [],
    memoryUsage: [],
    networkRequests: []
  };
  
  // 渲染性能监控
  static measureRenderTime(componentName, renderFunction) {
    const startTime = performance.now();
    const result = renderFunction();
    const endTime = performance.now();
    
    this.metrics.renderTimes.push({
      component: componentName,
      duration: endTime - startTime,
      timestamp: Date.now()
    });
    
    return result;
  }
  
  // 内存使用监控
  static async measureMemoryUsage() {
    if (Platform.OS === 'android') {
      const memInfo = await NativeModules.MemoryInfo.getMemoryInfo();
      this.metrics.memoryUsage.push({
        used: memInfo.used,
        total: memInfo.total,
        timestamp: Date.now()
      });
    }
  }
  
  // 网络请求监控
  static monitorNetworkRequest(url, method, startTime, endTime, success) {
    this.metrics.networkRequests.push({
      url,
      method,
      duration: endTime - startTime,
      success,
      timestamp: startTime
    });
  }
  
  // 生成性能报告
  static generateReport() {
    return {
      averageRenderTime: this.calculateAverageRenderTime(),
      memoryTrend: this.analyzeMemoryTrend(),
      networkPerformance: this.analyzeNetworkPerformance()
    };
  }
}

// 使用 Flipper 进行调试
const FlipperIntegration = {
  setup() {
    if (__DEV__) {
      // 网络请求监控
      const flipperNetworkPlugin = require('react-native-flipper').default;
      flipperNetworkPlugin.addPlugin({
        getId() { return 'NetworkPlugin'; },
        onConnect(connection) {
          // 监控网络请求
          this.connection = connection;
        },
        onDisconnect() {
          this.connection = null;
        },
        runInBackground() {
          return false;
        }
      });
    }
  }
};
```

### 9.3 测试策略

```javascript
// 单元测试示例
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../LoginScreen';

describe('LoginScreen', () => {
  it('should render login form', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });
  
  it('should handle login submission', async () => {
    const mockLogin = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen onLogin={mockLogin} />
    );
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Login'));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});

// E2E 测试 (Detox)
describe('App E2E', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  
  beforeEach(async () => {
    await device.reloadReactNative();
  });
  
  it('should login successfully', async () => {
    await element(by.id('emailInput')).typeText('test@example.com');
    await element(by.id('passwordInput')).typeText('password123');
    await element(by.id('loginButton')).tap();
    
    await waitFor(element(by.id('homeScreen')))
      .toBeVisible()
      .withTimeout(5000);
  });
});

// 集成测试
const IntegrationTests = {
  // API 集成测试
  async testAPIIntegration() {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] })
    });
    
    const result = await apiService.getData();
    expect(result.success).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/data'),
      expect.any(Object)
    );
  },
  
  // 导航集成测试
  testNavigationIntegration() {
    const mockNavigate = jest.fn();
    const navigation = { navigate: mockNavigate };
    
    const { getByText } = render(
      <HomeScreen navigation={navigation} />
    );
    
    fireEvent.press(getByText('Go to Profile'));
    expect(mockNavigate).toHaveBeenCalledWith('Profile');
  }
};
```

### 9.4 发布和部署

```javascript
// 自动化构建配置
const BuildConfiguration = {
  // Fastlane 配置 (iOS)
  fastlane: `
    # Fastfile
    default_platform(:ios)
    
    platform :ios do
      desc "Build and upload to TestFlight"
      lane :beta do
        increment_build_number
        build_app(scheme: "MyApp")
        upload_to_testflight
      end
      
      desc "Build and upload to App Store"
      lane :release do
        increment_version_number
        build_app(scheme: "MyApp")
        upload_to_app_store
      end
    end
  `,
  
  // Gradle 配置 (Android)
  gradle: `
    // android/app/build.gradle
    android {
      signingConfigs {
        release {
          storeFile file(MYAPP_UPLOAD_STORE_FILE)
          storePassword MYAPP_UPLOAD_STORE_PASSWORD
          keyAlias MYAPP_UPLOAD_KEY_ALIAS
          keyPassword MYAPP_UPLOAD_KEY_PASSWORD
        }
      }
      
      buildTypes {
        release {
          signingConfig signingConfigs.release
          minifyEnabled enableProguardInReleaseBuilds
          proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
      }
    }
  `,
  
  // CI/CD 配置
  cicd: `
    # .github/workflows/build.yml
    name: Build and Deploy
    
    on:
      push:
        branches: [main]
    
    jobs:
      build-ios:
        runs-on: macos-latest
        steps:
          - uses: actions/checkout@v2
          - name: Setup Node.js
            uses: actions/setup-node@v2
            with:
              node-version: '16'
          - name: Install dependencies
            run: npm install
          - name: Build iOS
            run: npx react-native run-ios --configuration Release
  `
};

// 版本管理
const VersionManagement = {
  // 自动版本号更新
  updateVersion(type = 'patch') {
    const package = require('./package.json');
    const [major, minor, patch] = package.version.split('.').map(Number);
    
    let newVersion;
    switch (type) {
      case 'major':
        newVersion = `${major + 1}.0.0`;
        break;
      case 'minor':
        newVersion = `${major}.${minor + 1}.0`;
        break;
      case 'patch':
      default:
        newVersion = `${major}.${minor}.${patch + 1}`;
        break;
    }
    
    // 更新 package.json
    package.version = newVersion;
    fs.writeFileSync('./package.json', JSON.stringify(package, null, 2));
    
    // 更新原生项目版本号
    this.updateIOSVersion(newVersion);
    this.updateAndroidVersion(newVersion);
    
    return newVersion;
  },
  
  // 更新 iOS 版本号
  updateIOSVersion(version) {
    const plistPath = './ios/MyApp/Info.plist';
    // 使用 plist 库更新版本号
    const plist = require('plist');
    const data = plist.parse(fs.readFileSync(plistPath, 'utf8'));
    data.CFBundleShortVersionString = version;
    data.CFBundleVersion = version;
    fs.writeFileSync(plistPath, plist.build(data));
  },
  
  // 更新 Android 版本号
  updateAndroidVersion(version) {
    const gradlePath = './android/app/build.gradle';
    let content = fs.readFileSync(gradlePath, 'utf8');
    content = content.replace(
      /versionName\s+"[^"]*"/,
      `versionName "${version}"`
    );
    fs.writeFileSync(gradlePath, content);
  }
};

// 热更新配置 (CodePush)
const CodePushConfiguration = {
  // 配置 CodePush
  setup() {
    // 安装 react-native-code-push
    // npm install --save react-native-code-push
    
    // iOS 配置
    const iosConfig = `
      // AppDelegate.m
      #import <CodePush/CodePush.h>
      
      - (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
        #if DEBUG
          return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
        #else
          return [CodePush bundleURL];
        #endif
      }
    `;
    
    // Android 配置
    const androidConfig = `
      // MainApplication.java
      @Override
      protected ReactNativeHost createReactNativeHost() {
        return new ReactNativeHost(this) {
          @Override
          protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
          }
        };
      }
    `;
  },
  
  // 发布热更新
  releaseUpdate() {
    const commands = [
      'code-push release-react MyApp-iOS ios',
      'code-push release-react MyApp-Android android'
    ];
    
    commands.forEach(command => {
      console.log(`Executing: ${command}`);
      // 执行命令
    });
  }
};
```

## 10. 高级主题

### 10.1 动画和手势

```javascript
// React Native Reanimated 2 使用
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedGestureHandler
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

// 基础动画
const BasicAnimations = () => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value
    };
  });
  
  const startAnimation = () => {
    translateX.value = withSpring(100);
    opacity.value = withTiming(0.5, { duration: 1000 });
  };
  
  return (
    <View>
      <Animated.View style={[styles.box, animatedStyle]} />
      <TouchableOpacity onPress={startAnimation}>
        <Text>Start Animation</Text>
      </TouchableOpacity>
    </View>
  );
};

// 手势处理
const GestureHandling = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
      translateY.value = context.startY + event.translationY;
    },
    onEnd: () => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    }
  });
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value }
      ]
    };
  });
  
  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.draggableBox, animatedStyle]} />
    </PanGestureHandler>
  );
};

// 复杂动画序列
const ComplexAnimations = () => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ]
    };
  });
  
  const startComplexAnimation = () => {
    // 序列动画
    scale.value = withTiming(1.5, { duration: 500 }, () => {
      runOnJS(() => console.log('Scale animation completed'))();
      scale.value = withSpring(1);
    });
    
    // 并行动画
    rotation.value = withTiming(360, { duration: 1000 }, () => {
      rotation.value = 0;
    });
  };
  
  return (
    <View>
      <Animated.View style={[styles.animatedBox, animatedStyle]} />
      <TouchableOpacity onPress={startComplexAnimation}>
        <Text>Start Complex Animation</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### 10.2 国际化 (i18n)

```javascript
// 国际化配置
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

// 语言资源
const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      login: 'Login',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      loginSuccess: 'Login successful',
      loginError: 'Login failed. Please try again.'
    }
  },
  zh: {
    translation: {
      welcome: '欢迎',
      login: '登录',
      email: '邮箱',
      password: '密码',
      forgotPassword: '忘记密码？',
      loginSuccess: '登录成功',
      loginError: '登录失败，请重试'
    }
  },
  ja: {
    translation: {
      welcome: 'ようこそ',
      login: 'ログイン',
      email: 'メール',
      password: 'パスワード',
      forgotPassword: 'パスワードを忘れましたか？',
      loginSuccess: 'ログイン成功',
      loginError: 'ログインに失敗しました。もう一度お試しください。'
    }
  }
};

// i18n 初始化
const initI18n = () => {
  const locales = RNLocalize.getLocales();
  const languageTag = locales[0]?.languageTag || 'en';
  
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: languageTag.split('-')[0], // 'en-US' -> 'en'
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      }
    });
};

// 使用翻译的组件
import { useTranslation } from 'react-i18next';

const LoginScreen = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('welcome')}</Text>
      
      <TextInput
        style={styles.input}
        placeholder={t('email')}
        value={email}
        onChangeText={setEmail}
      />
      
      <TextInput
        style={styles.input}
        placeholder={t('password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>{t('login')}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity>
        <Text style={styles.linkText}>{t('forgotPassword')}</Text>
      </TouchableOpacity>
      
      {/* 语言切换 */}
      <View style={styles.languageSelector}>
        <TouchableOpacity onPress={() => changeLanguage('en')}>
          <Text>English</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeLanguage('zh')}>
          <Text>中文</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeLanguage('ja')}>
          <Text>日本語</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 日期和数字格式化
const LocalizationUtils = {
  // 格式化日期
  formatDate(date, locale = 'en') {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  },
  
  // 格式化货币
  formatCurrency(amount, currency = 'USD', locale = 'en') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  },
  
  // 格式化数字
  formatNumber(number, locale = 'en') {
    return new Intl.NumberFormat(locale).format(number);
  }
};
```

### 10.3 安全性

```javascript
// 安全性最佳实践
const SecurityBestPractices = {
  // 1. 敏感数据存储
  secureStorage: {
    // 使用 Keychain (iOS) / Keystore (Android)
    async storeSecureData(key, value) {
      try {
        await Keychain.setInternetCredentials(key, key, value);
      } catch (error) {
        console.error('Failed to store secure data:', error);
      }
    },
    
    async getSecureData(key) {
      try {
        const credentials = await Keychain.getInternetCredentials(key);
        return credentials ? credentials.password : null;
      } catch (error) {
        console.error('Failed to get secure data:', error);
        return null;
      }
    },
    
    async removeSecureData(key) {
      try {
        await Keychain.resetInternetCredentials(key);
      } catch (error) {
        console.error('Failed to remove secure data:', error);
      }
    }
  },
  
  // 2. 网络安全
  networkSecurity: {
    // SSL Pinning
    setupSSLPinning() {
      const trustKit = require('react-native-ssl-pinning');
      
      const config = {
        'api.example.com': {
          includeSubdomains: true,
          publicKeyHashes: [
            'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
            'sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB='
          ]
        }
      };
      
      trustKit.init(config);
    },
    
    // 安全的 HTTP 请求
    async secureRequest(url, options = {}) {
      const defaultOptions = {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include'
      };
      
      const mergedOptions = { ...defaultOptions, ...options };
      
      try {
        const response = await fetch(url, mergedOptions);
        
        // 验证响应
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Secure request failed:', error);
        throw error;
      }
    }
  },
  
  // 3. 输入验证和清理
  inputValidation: {
    // 邮箱验证
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    
    // 密码强度验证
    validatePassword(password) {
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
      return {
        isValid: password.length >= minLength && hasUpperCase && 
                hasLowerCase && hasNumbers && hasSpecialChar,
        errors: {
          length: password.length < minLength,
          uppercase: !hasUpperCase,
          lowercase: !hasLowerCase,
          numbers: !hasNumbers,
          specialChar: !hasSpecialChar
        }
      };
    },
    
    // 清理用户输入
    sanitizeInput(input) {
      return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/[<>]/g, '')
        .trim();
    }
  },
  
  // 4. 生物识别认证
  biometricAuth: {
    async checkBiometricSupport() {
      try {
        const biometryType = await TouchID.isSupported();
        return biometryType;
      } catch (error) {
        console.error('Biometric not supported:', error);
        return false;
      }
    },
    
    async authenticateWithBiometric(reason = 'Authenticate to access the app') {
      try {
        const isAuthenticated = await TouchID.authenticate(reason, {
          fallbackLabel: 'Use Passcode',
          unifiedErrors: false,
          passcodeFallback: true
        });
        return isAuthenticated;
      } catch (error) {
        console.error('Biometric authentication failed:', error);
        return false;
      }
    }
  },
  
  // 5. 代码混淆和保护
  codeProtection: {
    // 使用 ProGuard (Android)
    proguardConfig: `
      # android/app/proguard-rules.pro
      -keep class com.facebook.react.** { *; }
      -keep class com.facebook.jni.** { *; }
      -dontwarn com.facebook.react.**
      -dontwarn com.facebook.jni.**
      
      # 保护敏感类
      -keep class com.myapp.security.** { *; }
      -keep class com.myapp.crypto.** { *; }
    `,
    
    // 检测调试器
    detectDebugger() {
      if (__DEV__) {
        return false; // 开发环境跳过检测
      }
      
      // 检测是否连接了调试器
      const start = Date.now();
      debugger; // 如果连接了调试器，这里会暂停
      const end = Date.now();
      
      return (end - start) > 100; // 如果暂停时间过长，可能连接了调试器
    },
    
    // 检测 Root/Jailbreak
    async detectRootJailbreak() {
      try {
        const JailMonkey = require('jail-monkey');
        return JailMonkey.isJailBroken();
      } catch (error) {
        console.error('Failed to detect root/jailbreak:', error);
        return false;
      }
    }
  }
};

// 安全的认证流程
class SecureAuthFlow {
  constructor() {
    this.maxLoginAttempts = 5;
    this.lockoutDuration = 15 * 60 * 1000; // 15分钟
  }
  
  async login(email, password) {
    // 检查是否被锁定
    const isLockedOut = await this.checkLockout(email);
    if (isLockedOut) {
      throw new Error('Account temporarily locked due to too many failed attempts');
    }
    
    // 验证输入
    if (!SecurityBestPractices.inputValidation.validateEmail(email)) {
      throw new Error('Invalid email format');
    }
    
    const passwordValidation = SecurityBestPractices.inputValidation.validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error('Password does not meet security requirements');
    }
    
    try {
      // 执行登录
      const response = await SecurityBestPractices.networkSecurity.secureRequest('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      // 清除失败计数
      await this.clearFailedAttempts(email);
      
      // 存储认证令牌
      await SecurityBestPractices.secureStorage.storeSecureData('authToken', response.token);
      
      return response;
    } catch (error) {
      // 记录失败尝试
      await this.recordFailedAttempt(email);
      throw error;
    }
  }
  
  async checkLockout(email) {
    const attempts = await AsyncStorage.getItem(`failed_attempts_${email}`);
    const lastAttempt = await AsyncStorage.getItem(`last_attempt_${email}`);
    
    if (attempts && lastAttempt) {
      const attemptCount = parseInt(attempts);
      const lastAttemptTime = parseInt(lastAttempt);
      
      if (attemptCount >= this.maxLoginAttempts) {
        const timeSinceLastAttempt = Date.now() - lastAttemptTime;
        return timeSinceLastAttempt < this.lockoutDuration;
      }
    }
    
    return false;
  }
  
  async recordFailedAttempt(email) {
    const currentAttempts = await AsyncStorage.getItem(`failed_attempts_${email}`) || '0';
    const newAttempts = parseInt(currentAttempts) + 1;
    
    await AsyncStorage.setItem(`failed_attempts_${email}`, newAttempts.toString());
    await AsyncStorage.setItem(`last_attempt_${email}`, Date.now().toString());
  }
  
  async clearFailedAttempts(email) {
    await AsyncStorage.removeItem(`failed_attempts_${email}`);
    await AsyncStorage.removeItem(`last_attempt_${email}`);
  }
}
```

## 11. 面试准备策略

### 11.1 技术面试准备

```javascript
// 面试常见编程题
const InterviewCodingQuestions = {
  // 1. 实现一个简单的状态管理器
  createStateManager() {
    class SimpleStateManager {
      constructor(initialState = {}) {
        this.state = initialState;
        this.listeners = [];
      }
      
      getState() {
        return { ...this.state };
      }
      
      setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifyListeners();
      }
      
      subscribe(listener) {
        this.listeners.push(listener);
        return () => {
          this.listeners = this.listeners.filter(l => l !== listener);
        };
      }
      
      notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
      }
    }
    
    return SimpleStateManager;
  },
  
  // 2. 实现防抖和节流
  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },
  
  throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        return func.apply(this, args);
      }
    };
  },
  
  // 3. 实现深拷贝
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
      return obj.map(item => this.deepClone(item));
    }
    
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  },
  
  // 4. 实现 Promise.all
  promiseAll(promises) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        reject(new TypeError('Argument must be an array'));
        return;
      }
      
      const results = [];
      let completedCount = 0;
      
      if (promises.length === 0) {
        resolve(results);
        return;
      }
      
      promises.forEach((promise, index) => {
        Promise.resolve(promise)
          .then(value => {
            results[index] = value;
            completedCount++;
            
            if (completedCount === promises.length) {
              resolve(results);
            }
          })
          .catch(reject);
      });
    });
  }
};

// 系统设计题准备
const SystemDesignQuestions = {
  // 设计一个聊天应用
  chatAppDesign: {
    architecture: {
      frontend: 'React Native',
      backend: 'Node.js + Socket.io',
      database: 'MongoDB + Redis',
      storage: 'AWS S3',
      push: 'Firebase Cloud Messaging'
    },
    
    components: [
      'Authentication Service',
      'Message Service',
      'User Service',
      'File Upload Service',
      'Push Notification Service',
      'Real-time Communication (WebSocket)'
    ],
    
    dataModels: {
      user: {
        id: 'string',
        username: 'string',
        email: 'string',
        avatar: 'string',
        lastSeen: 'timestamp',
        isOnline: 'boolean'
      },
      
      conversation: {
        id: 'string',
        participants: 'array<userId>',
        type: 'direct | group',
        name: 'string',
        lastMessage: 'messageId',
        createdAt: 'timestamp',
        updatedAt: 'timestamp'
      },
      
      message: {
        id: 'string',
        conversationId: 'string',
        senderId: 'string',
        content: 'string',
        type: 'text | image | file',
        timestamp: 'timestamp',
        readBy: 'array<userId>'
      }
    },
    
    scalabilityConsiderations: [
      'Message pagination and lazy loading',
      'Image compression and caching',
      'Database sharding by conversation',
      'CDN for media files',
      'Load balancing for WebSocket connections',
      'Message queue for offline users'
    ]
  },
  
  // 设计一个电商应用
  ecommerceAppDesign: {
    architecture: {
      frontend: 'React Native',
      backend: 'Microservices (Node.js)',
      database: 'PostgreSQL + Redis',
      search: 'Elasticsearch',
      payment: 'Stripe',
      cdn: 'CloudFront'
    },
    
    microservices: [
      'User Service',
      'Product Service',
      'Order Service',
      'Payment Service',
      'Inventory Service',
      'Recommendation Service',
      'Notification Service'
    ],
    
    performanceOptimizations: [
      'Product image lazy loading',
      'Search result caching',
      'Infinite scroll for product lists',
      'Offline cart storage',
      'Background sync for orders',
      'Push notifications for order updates'
    ]
  }
};
```

### 11.2 面试问题和答案

```javascript
// 常见面试问题及答案要点
const InterviewQA = {
  // React Native 基础
  basics: {
    q1: {
      question: "React Native 的工作原理是什么？",
      answer: `
        React Native 通过以下方式工作：
        1. JavaScript 线程运行 React 代码
        2. 生成虚拟 DOM 树
        3. 通过 Bridge 将渲染指令发送到原生线程
        4. 原生线程创建对应的原生 UI 组件
        5. 原生组件渲染到屏幕
        
        新架构 (Fabric) 改进：
        - 同步渲染，减少 Bridge 通信
        - JSI 直接调用原生方法
        - 更好的性能和类型安全
      `,
      keyPoints: [
        "Bridge 通信机制",
        "原生组件渲染",
        "新架构改进",
        "性能优势"
      ]
    },
    
    q2: {
      question: "React Native 与 React 的区别？",
      answer: `
        主要区别：
        1. 渲染目标：React 渲染到 DOM，RN 渲染到原生组件
        2. 组件库：React 使用 HTML 元素，RN 使用原生组件
        3. 样式系统：RN 使用 StyleSheet，支持 Flexbox
        4. 事件系统：RN 有触摸事件，手势处理
        5. 导航：RN 需要专门的导航库
        6. 平台 API：RN 可以访问设备原生功能
      `,
      keyPoints: [
        "渲染差异",
        "组件差异", 
        "样式差异",
        "平台特性"
      ]
    }
  },
  
  // 性能优化
  performance: {
    q1: {
      question: "如何优化 React Native 应用的性能？",
      answer: `
        性能优化策略：
        
        1. 渲染优化：
           - 使用 React.memo 避免不必要的重渲染
           - 使用 useMemo 和 useCallback 缓存计算结果
           - 优化 FlatList 配置
        
        2. 内存管理：
           - 及时清理定时器和事件监听
           - 优化图片加载和缓存
           - 避免内存泄漏
        
        3. Bundle 优化：
           - 代码分割和懒加载
           - 移除未使用的代码
           - 压缩和混淆
        
        4. 原生优化：
           - 使用原生模块处理复杂计算
           - 优化 Bridge 通信
      `,
      keyPoints: [
        "渲染优化",
        "内存管理",
        "Bundle 优化",
        "原生优化"
      ]
    }
  },
  
  // 状态管理
  stateManagement: {
    q1: {
      question: "比较不同的状态管理方案",
      answer: `
        状态管理方案比较：
        
        1. useState/useContext：
           - 适用：小到中型应用
           - 优点：简单，内置
           - 缺点：性能问题，复杂状态难管理
        
        2. Redux：
           - 适用：大型应用，复杂状态
           - 优点：可预测，调试工具好
           - 缺点：样板代码多，学习成本高
        
        3. MobX：
           - 适用：面向对象思维
           - 优点：简单，响应式
           - 缺点：魔法太多，调试困难
        
        4. Zustand：
           - 适用：中型应用
           - 优点：简单，TypeScript 友好
           - 缺点：生态相对较小
      `,
      keyPoints: [
        "适用场景",
        "优缺点分析",
        "选择标准",
        "最佳实践"
      ]
    }
  },
  
  // 项目经验
  projectExperience: {
    q1: {
      question: "描述一个你参与的 React Native 项目",
      answer: `
        项目描述模板：
        
        1. 项目背景：
           - 项目类型和规模
           - 技术栈选择原因
           - 团队规模和角色
        
        2. 技术挑战：
           - 遇到的主要技术难题
           - 解决方案和思路
           - 性能优化措施
        
        3. 架构设计：
           - 整体架构设计
           - 模块划分
           - 状态管理方案
        
        4. 项目成果：
           - 性能指标改进
           - 用户体验提升
           - 开发效率提升
      `,
      keyPoints: [
        "项目背景",
        "技术挑战",
        "解决方案",
        "项目成果"
      ]
    }
  }
};

// 面试准备清单
const InterviewPreparation = {
  technicalPrep: [
    "复习 React Native 核心概念",
    "准备常见编程题解答",
    "整理项目经验和技术难点",
    "练习系统设计题",
    "了解最新技术趋势"
  ],
  
  behavioralPrep: [
    "准备 STAR (Situation-Task-Action-Result) 格式的行为问题回答",
    "整理团队协作经验",
    "准备技术学习和成长故事",
    "思考职业规划和目标"
  ],
  
  practicalPrep: [
    "准备代码演示项目",
    "练习白板编程",
    "准备技术问题的提问",
    "了解目标公司的技术栈"
  ]
};
```

## 12. 总结和学习路径

### 12.1 学习路径建议

```javascript
const LearningPath = {
  // 初级阶段 (0-6个月)
  beginner: {
    duration: "0-6个月",
    goals: [
      "掌握 React Native 基础概念",
      "能够开发简单的移动应用",
      "理解组件化开发思想",
      "熟悉基本的调试技巧"
    ],
    topics: [
      "React 基础知识",
      "React Native 环境搭建",
      "核心组件和 API",
      "基础样式和布局",
      "简单的状态管理",
      "基础导航",
      "调试工具使用"
    ],
    projects: [
      "Todo List 应用",
      "天气查询应用",
      "简单的新闻阅读器",
      "计算器应用"
    ]
  },
  
  // 中级阶段 (6-18个月)
  intermediate: {
    duration: "6-18个月",
    goals: [
      "能够开发中等复杂度的应用",
      "掌握性能优化技巧",
      "理解原生模块开发",
      "具备团队协作能力"
    ],
    topics: [
      "高级组件模式",
      "性能优化技巧",
      "复杂状态管理",
      "原生模块开发",
      "动画和手势",
      "测试策略",
      "CI/CD 流程"
    ],
    projects: [
      "社交媒体应用",
      "电商应用",
      "聊天应用",
      "音乐播放器"
    ]
  },
  
  // 高级阶段 (18个月+)
  advanced: {
    duration: "18个月+",
    goals: [
      "能够设计大型应用架构",
      "具备技术领导能力",
      "能够解决复杂技术问题",
      "贡献开源项目"
    ],
    topics: [
      "架构设计模式",
      "微前端架构",
      "性能监控和分析",
      "安全性最佳实践",
      "团队技术管理",
      "开源贡献"
    ],
    projects: [
      "企业级应用开发",
      "开源库开发",
      "技术方案设计",
      "团队技术培训"
    ]
  }
};

// 持续学习建议
const ContinuousLearning = {
  dailyPractice: [
    "阅读官方文档更新",
    "关注技术博客和社区",
    "练习编程题",
    "代码 Review 和重构"
  ],
  
  weeklyGoals: [
    "学习一个新的技术概念",
    "完成一个小项目或功能",
    "参与技术讨论",
    "整理学习笔记"
  ],
  
  monthlyTargets: [
    "深入研究一个技术领域",
    "参与开源项目",
    "技术分享或写作",
    "参加技术会议或培训"
  ],
  
  resources: [
    "官方文档和 GitHub",
    "技术博客和教程",
    "在线课程和视频",
    "技术书籍",
    "开源项目",
    "技术社区和论坛"
  ]
};
```

### 12.2 面试成功要素

```javascript
const InterviewSuccessFactors = {
  technicalSkills: {
    weight: "40%",
    components: [
      "React Native 核心知识",
      "JavaScript/TypeScript 熟练度",
      "移动开发最佳实践",
      "性能优化经验",
      "问题解决能力"
    ]
  },
  
  projectExperience: {
    weight: "30%",
    components: [
      "实际项目经验",
      "技术难点解决",
      "架构设计能力",
      "团队协作经验",
      "项目管理能力"
    ]
  },
  
  communicationSkills: {
    weight: "20%",
    components: [
      "技术表达能力",
      "问题理解能力",
      "团队沟通能力",
      "学习分享能力",
      "英语沟通能力"
    ]
  },
  
  softSkills: {
    weight: "10%",
    components: [
      "学习能力",
      "适应能力",
      "责任心",
      "创新思维",
      "职业规划"
    ]
  }
};

// 面试准备时间规划
const InterviewTimeplan = {
  "4周前": [
    "评估当前技能水平",
    "制定学习计划",
    "开始系统复习",
    "准备项目作品集"
  ],
  
  "3周前": [
    "深入学习薄弱环节",
    "练习编程题",
    "整理项目经验",
    "准备技术问题回答"
  ],
  
  "2周前": [
    "模拟面试练习",
    "完善简历和作品集",
    "研究目标公司",
    "准备行为问题回答"
  ],
  
  "1周前": [
    "最后复习重点知识",
    "准备面试用品",
    "调整心态和状态",
    "确认面试安排"
  ],
  
  "面试当天": [
    "保持良好状态",
    "提前到达面试地点",
    "展示自信和专业",
    "积极回答问题"
  ]
};
```

---

## 结语

React Native 作为跨平台移动开发的重要技术，在移动应用开发领域占据重要地位。掌握 React Native 不仅需要理解其核心概念和技术原理，更需要在实际项目中积累经验，不断优化和改进。

本指南涵盖了 React Native 面试的核心要点，从基础概念到高级主题，从技术实现到项目经验，希望能够帮助你在面试中展现出扎实的技术功底和丰富的实战经验。

记住，技术面试不仅是对知识的考查，更是对思维方式和解决问题能力的评估。保持持续学习的心态，关注技术发展趋势，在实践中不断提升自己的技术水平。

祝你面试成功！🚀

---

*最后更新时间：2024年*
*版本：v1.0*