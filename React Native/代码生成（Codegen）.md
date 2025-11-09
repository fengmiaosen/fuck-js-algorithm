# React Native 代码生成（Codegen）

## 核心原理

React Native Codegen 是新架构（New Architecture）的核心组件，用于自动生成类型安全的原生模块和组件接口代码。

### 工作流程
1. **解析规范**：读取 JavaScript/TypeScript 规范文件
2. **生成代码**：自动生成 C++、Java、Objective-C 代码
3. **类型安全**：确保 JS 和原生代码之间的类型一致性
4. **性能优化**：减少运行时类型检查和转换开销

## 主要使用场景

### 1. TurboModules（原生模块）
为原生模块生成类型安全的接口代码

**规范文件示例：**
```typescript
// NativeCalculator.ts
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  add(a: number, b: number): Promise<number>;
  multiply(a: number, b: number): number;
  getConstants(): {
    PI: number;
    E: number;
  };
}

export default TurboModuleRegistry.getEnforcing<Spec>('Calculator');
```

**生成的原生代码（iOS）：**
```objc
// RCTNativeCalculator.h
@protocol NativeCalculatorSpec <RCTBridgeModule, RCTTurboModule>
- (void)add:(double)a b:(double)b resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;
- (NSNumber *)multiply:(double)a b:(double)b;
- (NSDictionary *)getConstants;
@end
```

### 2. Fabric Components（原生组件）
为自定义原生组件生成接口代码

**规范文件示例：**
```typescript
// MyButtonNativeComponent.ts
import type { ViewProps } from 'react-native';
import type { HostComponent } from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

interface NativeProps extends ViewProps {
  title: string;
  color?: string;
  onPress?: () => void;
}

export default codegenNativeComponent<NativeProps>('MyButton');
```

### 3. 事件处理
生成类型安全的事件处理代码

```typescript
// 事件规范
interface NativeProps extends ViewProps {
  onCustomEvent?: (event: {
    nativeEvent: {
      value: string;
      timestamp: number;
    };
  }) => void;
}
```

## 配置和使用

### 1. 生成命令
```bash
# 生成代码
npx react-native codegen

# 清理并重新生成
npx react-native codegen --clean
```

### 2. 项目配置
```json
// react-native.config.js
module.exports = {
  dependencies: {
    'react-native': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native/android',
        },
      },
    },
  },
};
```

## 优势和特点

### 1. 类型安全
- 编译时类型检查
- 减少运行时错误
- 自动类型转换

### 2. 性能提升
- 减少 Bridge 开销
- 直接内存访问
- 优化的序列化/反序列化

### 3. 开发体验
- 自动代码生成
- 一致的 API 接口
- 更好的 IDE 支持

## 实际应用示例

### TurboModule 完整示例
```typescript
// 1. 定义规范
export interface Spec extends TurboModule {
  getCurrentTime(): number;
  fetchUserData(userId: string): Promise<{
    name: string;
    email: string;
  }>;
}

// 2. 使用模块
import NativeUserModule from './NativeUserModule';

const currentTime = NativeUserModule.getCurrentTime();
const userData = await NativeUserModule.fetchUserData('123');
```

### Fabric Component 完整示例
```typescript
// 1. 定义组件规范
interface NativeProps extends ViewProps {
  data: ReadonlyArray<{
    id: string;
    title: string;
  }>;
  onItemPress?: (event: {
    nativeEvent: { itemId: string };
  }) => void;
}

export default codegenNativeComponent<NativeProps>('CustomListView');

// 2. 使用组件
<CustomListView
  data={[{ id: '1', title: 'Item 1' }]}
  onItemPress={(event) => {
    console.log('Pressed:', event.nativeEvent.itemId);
  }}
/>
```

## 注意事项

1. **兼容性**：需要 React Native 0.68+ 版本
2. **类型限制**：支持的类型有限，需要遵循规范
3. **构建配置**：需要正确配置 Metro 和原生构建系统
4. **调试**：生成的代码难以直接调试，需要通过规范文件

Codegen 是 React Native 新架构的基础，为高性能、类型安全的跨平台开发提供了强有力的支持。