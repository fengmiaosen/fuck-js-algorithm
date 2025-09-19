# JavaScript 中 Set、Map、WeakSet 和 WeakMap 的区别

> 参考资料：https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/6

## 概述

JavaScript ES6 引入了四种新的数据结构：Set、Map、WeakSet 和 WeakMap。它们各有特点和适用场景，本文将详细介绍它们的区别和使用方法。

## 1. Set

### 特性
- **唯一性**：Set 中的值是唯一的，不会有重复值
- **任意类型**：可以存储任意类型的值
- **有序性**：按照插入顺序迭代
- **可迭代**：支持 for...of、forEach 等迭代方法
- **强引用**：对存储的对象保持强引用

### 基本用法

```javascript
// 创建 Set
const mySet = new Set();
const mySet2 = new Set([1, 2, 3, 4, 4]); // [1, 2, 3, 4]

// 添加值
mySet.add(1);
mySet.add(2);
mySet.add(2); // 重复值会被忽略

// 检查是否存在
console.log(mySet.has(1)); // true

// 删除值
mySet.delete(1);

// 获取大小
console.log(mySet.size); // 1

// 清空
mySet.clear();
```

### 常见应用场景

```javascript
// 数组去重
const arr = [1, 2, 2, 3, 4, 4, 5];
const uniqueArr = [...new Set(arr)];
console.log(uniqueArr); // [1, 2, 3, 4, 5]

// 字符串去重
const str = "hello";
const uniqueChars = [...new Set(str)].join('');
console.log(uniqueChars); // "helo"

// 交集、并集、差集
const setA = new Set([1, 2, 3]);
const setB = new Set([2, 3, 4]);

// 并集
const union = new Set([...setA, ...setB]);
console.log(union); // Set {1, 2, 3, 4}

// 交集
const intersection = new Set([...setA].filter(x => setB.has(x)));
console.log(intersection); // Set {2, 3}

// 差集
const difference = new Set([...setA].filter(x => !setB.has(x)));
console.log(difference); // Set {1}
```

## 2. Map

### 特性
- **键值对**：存储键值对，键可以是任意类型
- **有序性**：按照插入顺序迭代
- **可迭代**：支持 for...of、forEach 等迭代方法
- **强引用**：对键和值都保持强引用
- **大小属性**：有 size 属性

### 基本用法

```javascript
// 创建 Map
const myMap = new Map();
const myMap2 = new Map([
  ['key1', 'value1'],
  ['key2', 'value2']
]);

// 设置键值对
myMap.set('name', 'John');
myMap.set(1, 'number key');
myMap.set(true, 'boolean key');

// 获取值
console.log(myMap.get('name')); // 'John'

// 检查是否存在键
console.log(myMap.has('name')); // true

// 删除键值对
myMap.delete('name');

// 获取大小
console.log(myMap.size);

// 清空
myMap.clear();
```

### Map vs Object

```javascript
// Object 的限制
const obj = {};
obj[1] = 'number';
obj['1'] = 'string';
console.log(obj); // { '1': 'string' } - 键被转换为字符串

// Map 的优势
const map = new Map();
map.set(1, 'number');
map.set('1', 'string');
map.set(true, 'boolean');
map.set({}, 'object');
console.log(map.size); // 4 - 键保持原始类型

// 迭代方式
for (const [key, value] of map) {
  console.log(key, value);
}

// 获取所有键、值、条目
console.log([...map.keys()]);
console.log([...map.values()]);
console.log([...map.entries()]);
```

### 常见应用场景

```javascript
// 缓存系统
class Cache {
  constructor() {
    this.cache = new Map();
  }
  
  get(key) {
    return this.cache.get(key);
  }
  
  set(key, value) {
    this.cache.set(key, value);
  }
  
  has(key) {
    return this.cache.has(key);
  }
  
  clear() {
    this.cache.clear();
  }
}

// 计数器
function countWords(text) {
  const wordCount = new Map();
  const words = text.split(' ');
  
  for (const word of words) {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  }
  
  return wordCount;
}

const text = "hello world hello";
console.log(countWords(text)); // Map { 'hello' => 2, 'world' => 1 }
```

## 3. WeakSet

### 特性
- **弱引用**：对存储的对象保持弱引用，不阻止垃圾回收
- **只能存储对象**：不能存储原始值
- **不可迭代**：没有 size 属性，不能使用 for...of
- **有限方法**：只有 add、delete、has 方法

### 基本用法

```javascript
const weakSet = new WeakSet();

const obj1 = { name: 'object1' };
const obj2 = { name: 'object2' };

// 添加对象
weakSet.add(obj1);
weakSet.add(obj2);

// 检查是否存在
console.log(weakSet.has(obj1)); // true

// 删除对象
weakSet.delete(obj1);

// 不能添加原始值
// weakSet.add(1); // TypeError
// weakSet.add('string'); // TypeError
```

### 垃圾回收示例

```javascript
let obj = { data: 'some data' };
const weakSet = new WeakSet();
weakSet.add(obj);

console.log(weakSet.has(obj)); // true

// 当 obj 被设置为 null 时，WeakSet 中的引用也会被垃圾回收
obj = null;
// 此时 WeakSet 中的对象可能已经被垃圾回收（取决于 GC 时机）
```

### 常见应用场景

```javascript
// 跟踪对象状态
class ObjectTracker {
  constructor() {
    this.processedObjects = new WeakSet();
  }
  
  process(obj) {
    if (this.processedObjects.has(obj)) {
      console.log('Object already processed');
      return;
    }
    
    // 处理对象
    console.log('Processing object:', obj);
    this.processedObjects.add(obj);
  }
}

const tracker = new ObjectTracker();
const myObj = { id: 1 };

tracker.process(myObj); // Processing object: { id: 1 }
tracker.process(myObj); // Object already processed

// DOM 节点跟踪
const visitedNodes = new WeakSet();

function markAsVisited(node) {
  visitedNodes.add(node);
}

function hasBeenVisited(node) {
  return visitedNodes.has(node);
}
```

## 4. WeakMap

### 特性
- **弱引用键**：对键保持弱引用，不阻止垃圾回收
- **键必须是对象**：键只能是对象，不能是原始值
- **不可迭代**：没有 size 属性，不能使用 for...of
- **有限方法**：只有 get、set、delete、has 方法

### 基本用法

```javascript
const weakMap = new WeakMap();

const key1 = { id: 1 };
const key2 = { id: 2 };

// 设置键值对
weakMap.set(key1, 'value1');
weakMap.set(key2, 'value2');

// 获取值
console.log(weakMap.get(key1)); // 'value1'

// 检查是否存在键
console.log(weakMap.has(key1)); // true

// 删除键值对
weakMap.delete(key1);

// 键必须是对象
// weakMap.set('string', 'value'); // TypeError
// weakMap.set(1, 'value'); // TypeError
```

### 常见应用场景

```javascript
// 私有数据存储
const privateData = new WeakMap();

class Person {
  constructor(name, age) {
    // 将私有数据存储在 WeakMap 中
    privateData.set(this, { name, age });
  }
  
  getName() {
    return privateData.get(this).name;
  }
  
  getAge() {
    return privateData.get(this).age;
  }
  
  setAge(age) {
    const data = privateData.get(this);
    data.age = age;
  }
}

const person = new Person('John', 30);
console.log(person.getName()); // 'John'
console.log(person.getAge()); // 30

// DOM 元素关联数据
const elementData = new WeakMap();

function attachData(element, data) {
  elementData.set(element, data);
}

function getData(element) {
  return elementData.get(element);
}

// 对象元数据
const metadata = new WeakMap();

function addMetadata(obj, meta) {
  metadata.set(obj, meta);
}

function getMetadata(obj) {
  return metadata.get(obj);
}

const myObject = { value: 42 };
addMetadata(myObject, { created: new Date(), version: '1.0' });
console.log(getMetadata(myObject));
```

## 对比总结

| 特性 | Set | Map | WeakSet | WeakMap |
|------|-----|-----|---------|----------|
| 存储内容 | 唯一值 | 键值对 | 唯一对象 | 对象键值对 |
| 键类型 | - | 任意类型 | - | 仅对象 |
| 值类型 | 任意类型 | 任意类型 | 仅对象 | 任意类型 |
| 引用类型 | 强引用 | 强引用 | 弱引用 | 弱引用(键) |
| 可迭代 | ✓ | ✓ | ✗ | ✗ |
| size 属性 | ✓ | ✓ | ✗ | ✗ |
| 垃圾回收 | 阻止 | 阻止 | 不阻止 | 不阻止(键) |

## 核心区别详解

### 1. 引用类型的区别

**强引用 (Set, Map)**
```javascript
let obj = { name: 'test' };
const set = new Set([obj]);
const map = new Map([[obj, 'value']]);

// 即使将 obj 设置为 null，对象仍然存在于 Set 和 Map 中
obj = null;
console.log(set.size); // 1
console.log(map.size); // 1
// 对象不会被垃圾回收，因为 Set 和 Map 持有强引用
```

**弱引用 (WeakSet, WeakMap)**
```javascript
let obj = { name: 'test' };
const weakSet = new WeakSet([obj]);
const weakMap = new WeakMap([[obj, 'value']]);

// 当 obj 被设置为 null 时，WeakSet 和 WeakMap 中的引用可能被垃圾回收
obj = null;
// 对象可能被垃圾回收（取决于 GC 时机）
// 无法直接验证，因为 WeakSet 和 WeakMap 不可迭代
```

### 2. 可迭代性的区别

```javascript
// Set 和 Map 可迭代
const set = new Set([1, 2, 3]);
const map = new Map([['a', 1], ['b', 2]]);

// 可以使用 for...of
for (const value of set) {
  console.log(value);
}

for (const [key, value] of map) {
  console.log(key, value);
}

// 可以使用 forEach
set.forEach(value => console.log(value));
map.forEach((value, key) => console.log(key, value));

// 有 size 属性
console.log(set.size, map.size);

// WeakSet 和 WeakMap 不可迭代
const weakSet = new WeakSet();
const weakMap = new WeakMap();

// 以下操作都不支持
// for (const value of weakSet) {} // TypeError
// weakSet.forEach() // TypeError
// console.log(weakSet.size) // undefined
```

### 3. 存储类型的限制

```javascript
// Set 和 Map 可以存储任意类型
const set = new Set([1, 'string', true, {}, null, undefined]);
const map = new Map([
  [1, 'number key'],
  ['string', 'string key'],
  [true, 'boolean key'],
  [{}, 'object key'],
  [null, 'null key']
]);

// WeakSet 只能存储对象
const weakSet = new WeakSet();
const obj = {};
weakSet.add(obj); // ✓ 正确
// weakSet.add(1); // ✗ TypeError
// weakSet.add('string'); // ✗ TypeError

// WeakMap 的键只能是对象
const weakMap = new WeakMap();
weakMap.set(obj, 'any value'); // ✓ 正确
// weakMap.set('string', 'value'); // ✗ TypeError
// weakMap.set(1, 'value'); // ✗ TypeError
```

## 性能对比

```javascript
// 性能测试示例
function performanceTest() {
  const iterations = 100000;
  
  // Set vs Array (查找性能)
  console.time('Set lookup');
  const set = new Set();
  for (let i = 0; i < iterations; i++) {
    set.add(i);
  }
  for (let i = 0; i < iterations; i++) {
    set.has(i);
  }
  console.timeEnd('Set lookup');
  
  console.time('Array lookup');
  const arr = [];
  for (let i = 0; i < iterations; i++) {
    arr.push(i);
  }
  for (let i = 0; i < iterations; i++) {
    arr.includes(i);
  }
  console.timeEnd('Array lookup');
  
  // Map vs Object (访问性能)
  console.time('Map access');
  const map = new Map();
  for (let i = 0; i < iterations; i++) {
    map.set(i, i);
  }
  for (let i = 0; i < iterations; i++) {
    map.get(i);
  }
  console.timeEnd('Map access');
  
  console.time('Object access');
  const obj = {};
  for (let i = 0; i < iterations; i++) {
    obj[i] = i;
  }
  for (let i = 0; i < iterations; i++) {
    obj[i];
  }
  console.timeEnd('Object access');
}

// 运行性能测试
// performanceTest();
```

## 实际应用场景

### 1. Set 的应用场景

```javascript
// 数组去重
function uniqueArray(arr) {
  return [...new Set(arr)];
}

// 集合运算
class SetOperations {
  static union(setA, setB) {
    return new Set([...setA, ...setB]);
  }
  
  static intersection(setA, setB) {
    return new Set([...setA].filter(x => setB.has(x)));
  }
  
  static difference(setA, setB) {
    return new Set([...setA].filter(x => !setB.has(x)));
  }
}

// 权限检查
class PermissionChecker {
  constructor(permissions) {
    this.permissions = new Set(permissions);
  }
  
  hasPermission(permission) {
    return this.permissions.has(permission);
  }
  
  addPermission(permission) {
    this.permissions.add(permission);
  }
  
  removePermission(permission) {
    this.permissions.delete(permission);
  }
}
```

### 2. Map 的应用场景

```javascript
// 缓存实现
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  
  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      // 重新插入以更新顺序
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return -1;
  }
  
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // 删除最久未使用的项
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}

// 事件系统
class EventEmitter {
  constructor() {
    this.events = new Map();
  }
  
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(callback);
  }
  
  off(event, callback) {
    if (this.events.has(event)) {
      this.events.get(event).delete(callback);
    }
  }
  
  emit(event, ...args) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(callback => {
        callback(...args);
      });
    }
  }
}
```

### 3. WeakSet 的应用场景

```javascript
// 对象标记
const processedObjects = new WeakSet();

function processObject(obj) {
  if (processedObjects.has(obj)) {
    console.log('Already processed');
    return;
  }
  
  // 处理对象
  console.log('Processing...', obj);
  processedObjects.add(obj);
}

// DOM 节点跟踪
const observedElements = new WeakSet();

function observeElement(element) {
  if (observedElements.has(element)) {
    return;
  }
  
  observedElements.add(element);
  
  // 添加事件监听器
  element.addEventListener('click', handleClick);
}

function handleClick(event) {
  console.log('Element clicked:', event.target);
}
```

### 4. WeakMap 的应用场景

```javascript
// 私有属性实现
const privateProps = new WeakMap();

class BankAccount {
  constructor(balance) {
    privateProps.set(this, { balance });
  }
  
  getBalance() {
    return privateProps.get(this).balance;
  }
  
  deposit(amount) {
    const props = privateProps.get(this);
    props.balance += amount;
  }
  
  withdraw(amount) {
    const props = privateProps.get(this);
    if (props.balance >= amount) {
      props.balance -= amount;
      return true;
    }
    return false;
  }
}

// DOM 元素数据关联
const elementData = new WeakMap();

function attachComponentData(element, component) {
  elementData.set(element, component);
}

function getComponentData(element) {
  return elementData.get(element);
}

// 对象关系映射
const relationships = new WeakMap();

function setParent(child, parent) {
  if (!relationships.has(child)) {
    relationships.set(child, {});
  }
  relationships.get(child).parent = parent;
}

function getParent(child) {
  const rel = relationships.get(child);
  return rel ? rel.parent : null;
}
```

## 最佳实践

### 1. 选择合适的数据结构

```javascript
// 根据需求选择
function chooseDataStructure() {
  // 需要唯一值集合 → Set
  const uniqueIds = new Set();
  
  // 需要键值对映射，键可能是非字符串 → Map
  const cache = new Map();
  
  // 需要跟踪对象但不影响垃圾回收 → WeakSet
  const processedObjects = new WeakSet();
  
  // 需要为对象关联数据但不影响垃圾回收 → WeakMap
  const objectMetadata = new WeakMap();
}
```

### 2. 内存管理

```javascript
// 避免内存泄漏
class ComponentManager {
  constructor() {
    // 使用 WeakMap 避免内存泄漏
    this.componentData = new WeakMap();
    this.eventListeners = new WeakMap();
  }
  
  createComponent(element, config) {
    this.componentData.set(element, config);
    
    const listeners = new Map();
    this.eventListeners.set(element, listeners);
    
    // 当元素被移除时，WeakMap 中的数据会自动清理
  }
  
  destroyComponent(element) {
    // 手动清理事件监听器
    const listeners = this.eventListeners.get(element);
    if (listeners) {
      listeners.forEach((listener, event) => {
        element.removeEventListener(event, listener);
      });
    }
    
    // WeakMap 中的数据会自动清理
  }
}
```

### 3. 性能优化

```javascript
// 合理使用数据结构提升性能
class PerformantDataManager {
  constructor() {
    // 频繁查找操作使用 Set
    this.activeUsers = new Set();
    
    // 需要键值映射使用 Map
    this.userCache = new Map();
    
    // 临时对象跟踪使用 WeakSet
    this.tempObjects = new WeakSet();
    
    // 对象关联数据使用 WeakMap
    this.objectMetadata = new WeakMap();
  }
  
  // O(1) 时间复杂度的查找
  isUserActive(userId) {
    return this.activeUsers.has(userId);
  }
  
  // O(1) 时间复杂度的获取
  getUserData(userId) {
    return this.userCache.get(userId);
  }
}
```

## 总结

### 核心差异

1. **引用类型**：
   - Set/Map：强引用，阻止垃圾回收
   - WeakSet/WeakMap：弱引用，不阻止垃圾回收

2. **存储限制**：
   - Set/Map：可存储任意类型
   - WeakSet：只能存储对象
   - WeakMap：键只能是对象

3. **可迭代性**：
   - Set/Map：可迭代，有 size 属性
   - WeakSet/WeakMap：不可迭代，无 size 属性

4. **方法支持**：
   - Set/Map：完整的方法集合
   - WeakSet/WeakMap：有限的方法集合

### 使用建议

1. **Set**：数组去重、集合运算、权限检查
2. **Map**：缓存系统、事件管理、计数器
3. **WeakSet**：对象状态跟踪、DOM 节点标记
4. **WeakMap**：私有属性、对象元数据、组件数据关联

选择合适的数据结构可以提高代码性能、避免内存泄漏，并使代码更加清晰和易维护。