// JavaScript 中 Set、Map、WeakSet 和 WeakMap 的实际演示

console.log('=== Set 演示 ===');

// 1. Set 基本用法
const mySet = new Set([1, 2, 3, 3, 4, 4]);
console.log('Set 去重:', [...mySet]); // [1, 2, 3, 4]

// 2. Set 数组去重
const arr = [1, 2, 2, 3, 4, 4, 5];
const uniqueArr = [...new Set(arr)];
console.log('数组去重:', uniqueArr);

// 3. Set 集合运算
const setA = new Set([1, 2, 3]);
const setB = new Set([2, 3, 4]);

// 并集
const union = new Set([...setA, ...setB]);
console.log('并集:', [...union]);

// 交集
const intersection = new Set([...setA].filter(x => setB.has(x)));
console.log('交集:', [...intersection]);

// 差集
const difference = new Set([...setA].filter(x => !setB.has(x)));
console.log('差集:', [...difference]);

console.log('\n=== Map 演示 ===');

// 1. Map 基本用法
const myMap = new Map();
myMap.set('name', 'John');
myMap.set(1, 'number key');
myMap.set(true, 'boolean key');
myMap.set({id: 1}, 'object key');

console.log('Map 大小:', myMap.size);
console.log('获取值:', myMap.get('name'));

// 2. Map vs Object 键类型对比
const obj = {};
obj[1] = 'number';
obj['1'] = 'string';
console.log('Object 键转换:', obj); // { '1': 'string' }

const map = new Map();
map.set(1, 'number');
map.set('1', 'string');
console.log('Map 键保持类型:', [...map.entries()]);

// 3. Map 计数器示例
function countWords(text) {
  const wordCount = new Map();
  const words = text.split(' ');
  
  for (const word of words) {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  }
  
  return wordCount;
}

const text = "hello world hello javascript world";
const wordCount = countWords(text);
console.log('单词计数:', [...wordCount.entries()]);

// 4. Map 迭代方式
console.log('Map 键:', [...myMap.keys()]);
console.log('Map 值:', [...myMap.values()]);

console.log('\n=== WeakSet 演示 ===');

// 1. WeakSet 基本用法
const weakSet = new WeakSet();

const obj1 = { name: 'object1' };
const obj2 = { name: 'object2' };

weakSet.add(obj1);
weakSet.add(obj2);

console.log('WeakSet 包含 obj1:', weakSet.has(obj1));
console.log('WeakSet 包含 obj2:', weakSet.has(obj2));

weakSet.delete(obj1);
console.log('删除后 WeakSet 包含 obj1:', weakSet.has(obj1));

// 2. WeakSet 对象跟踪示例
class ObjectTracker {
  constructor() {
    this.processedObjects = new WeakSet();
  }
  
  process(obj) {
    if (this.processedObjects.has(obj)) {
      console.log('对象已处理过:', obj.name);
      return;
    }
    
    console.log('正在处理对象:', obj.name);
    this.processedObjects.add(obj);
  }
}

const tracker = new ObjectTracker();
const testObj = { name: 'test' };

tracker.process(testObj);
tracker.process(testObj); // 第二次调用会显示已处理

// 3. WeakSet 类型限制演示
try {
  weakSet.add(1); // 这会抛出错误
} catch (error) {
  console.log('WeakSet 不能添加原始值:', error.message);
}

console.log('\n=== WeakMap 演示 ===');

// 1. WeakMap 基本用法
const weakMap = new WeakMap();

const key1 = { id: 1 };
const key2 = { id: 2 };

weakMap.set(key1, 'value1');
weakMap.set(key2, 'value2');

console.log('WeakMap 获取值:', weakMap.get(key1));
console.log('WeakMap 包含 key1:', weakMap.has(key1));

weakMap.delete(key1);
console.log('删除后 WeakMap 包含 key1:', weakMap.has(key1));

// 2. WeakMap 私有属性实现
const privateData = new WeakMap();

class Person {
  constructor(name, age) {
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
  
  toString() {
    const data = privateData.get(this);
    return `Person(${data.name}, ${data.age})`;
  }
}

const person1 = new Person('Alice', 25);
const person2 = new Person('Bob', 30);

console.log('Person1:', person1.toString());
console.log('Person2:', person2.toString());

person1.setAge(26);
console.log('Person1 更新年龄后:', person1.toString());

// 3. WeakMap 对象元数据示例
const metadata = new WeakMap();

function addMetadata(obj, meta) {
  metadata.set(obj, meta);
}

function getMetadata(obj) {
  return metadata.get(obj);
}

const myObject = { value: 42 };
addMetadata(myObject, { 
  created: new Date().toISOString(), 
  version: '1.0',
  author: 'Developer'
});

console.log('对象元数据:', getMetadata(myObject));

// 4. WeakMap 键类型限制演示
try {
  weakMap.set('string', 'value'); // 这会抛出错误
} catch (error) {
  console.log('WeakMap 键必须是对象:', error.message);
}

console.log('\n=== 性能对比演示 ===');

// Set vs Array 查找性能
function performanceTest() {
  const size = 10000;
  const testData = Array.from({ length: size }, (_, i) => i);
  
  // Set 查找
  console.time('Set 查找性能');
  const testSet = new Set(testData);
  for (let i = 0; i < size; i++) {
    testSet.has(i);
  }
  console.timeEnd('Set 查找性能');
  
  // Array 查找
  console.time('Array 查找性能');
  for (let i = 0; i < size; i++) {
    testData.includes(i);
  }
  console.timeEnd('Array 查找性能');
  
  // Map vs Object 访问性能
  console.time('Map 访问性能');
  const testMap = new Map();
  for (let i = 0; i < size; i++) {
    testMap.set(i, i);
  }
  for (let i = 0; i < size; i++) {
    testMap.get(i);
  }
  console.timeEnd('Map 访问性能');
  
  console.time('Object 访问性能');
  const testObj = {};
  for (let i = 0; i < size; i++) {
    testObj[i] = i;
  }
  for (let i = 0; i < size; i++) {
    testObj[i];
  }
  console.timeEnd('Object 访问性能');
}

performanceTest();

console.log('\n=== 实际应用场景演示 ===');

// 1. 缓存系统 (Map)
class SimpleCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }
  
  get(key) {
    if (this.cache.has(key)) {
      // 移到最后（LRU策略）
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return null;
  }
  
  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // 删除最久未使用的项
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
  
  size() {
    return this.cache.size;
  }
}

const cache = new SimpleCache(3);
cache.set('a', 1);
cache.set('b', 2);
cache.set('c', 3);
console.log('缓存大小:', cache.size());

cache.set('d', 4); // 会删除 'a'
console.log('添加新项后，获取 a:', cache.get('a')); // null
console.log('获取 b:', cache.get('b')); // 2

// 2. 权限检查系统 (Set)
class PermissionChecker {
  constructor(permissions = []) {
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
  
  getAllPermissions() {
    return [...this.permissions];
  }
}

const userPermissions = new PermissionChecker(['read', 'write']);
console.log('用户权限:', userPermissions.getAllPermissions());
console.log('有读权限:', userPermissions.hasPermission('read'));
console.log('有删除权限:', userPermissions.hasPermission('delete'));

userPermissions.addPermission('delete');
console.log('添加删除权限后:', userPermissions.getAllPermissions());

// 3. 组件状态管理 (WeakMap)
const componentStates = new WeakMap();

class Component {
  constructor(name) {
    componentStates.set(this, {
      name,
      mounted: false,
      props: {},
      state: {}
    });
  }
  
  mount() {
    const state = componentStates.get(this);
    state.mounted = true;
    console.log(`组件 ${state.name} 已挂载`);
  }
  
  unmount() {
    const state = componentStates.get(this);
    state.mounted = false;
    console.log(`组件 ${state.name} 已卸载`);
  }
  
  isMounted() {
    return componentStates.get(this).mounted;
  }
  
  setState(newState) {
    const state = componentStates.get(this);
    Object.assign(state.state, newState);
  }
  
  getState() {
    return componentStates.get(this).state;
  }
}

const comp1 = new Component('Header');
const comp2 = new Component('Footer');

comp1.mount();
comp1.setState({ title: 'My App' });
console.log('组件1状态:', comp1.getState());
console.log('组件1是否挂载:', comp1.isMounted());

comp2.mount();
comp2.setState({ copyright: '2024' });
console.log('组件2状态:', comp2.getState());

console.log('\n=== 垃圾回收演示 ===');

// 强引用 vs 弱引用
function demonstrateGarbageCollection() {
  // 强引用示例
  let strongObj = { data: 'strong reference' };
  const strongSet = new Set([strongObj]);
  const strongMap = new Map([[strongObj, 'value']]);
  
  console.log('强引用 - Set 包含对象:', strongSet.has(strongObj));
  console.log('强引用 - Map 包含对象:', strongMap.has(strongObj));
  
  // 即使设置为 null，对象仍然被 Set 和 Map 引用
  strongObj = null;
  console.log('设置为 null 后 - Set 大小:', strongSet.size);
  console.log('设置为 null 后 - Map 大小:', strongMap.size);
  
  // 弱引用示例
  let weakObj = { data: 'weak reference' };
  const weakSet = new WeakSet([weakObj]);
  const weakMap = new WeakMap([[weakObj, 'value']]);
  
  console.log('弱引用 - WeakSet 包含对象:', weakSet.has(weakObj));
  console.log('弱引用 - WeakMap 包含对象:', weakMap.has(weakObj));
  
  // 保存引用用于后续检查
  const objRef = weakObj;
  
  // 设置为 null，对象可能被垃圾回收
  weakObj = null;
  
  // 注意：垃圾回收是异步的，这里只是演示概念
  console.log('设置为 null 后 - WeakSet 仍包含对象:', weakSet.has(objRef));
  console.log('设置为 null 后 - WeakMap 仍包含对象:', weakMap.has(objRef));
  console.log('注意：实际的垃圾回收是异步的，对象可能稍后被回收');
}

demonstrateGarbageCollection();

console.log('\n=== 总结 ===');
console.log('Set: 唯一值集合，强引用，可迭代');
console.log('Map: 键值对映射，任意类型键，强引用，可迭代');
console.log('WeakSet: 对象集合，弱引用，不可迭代，防止内存泄漏');
console.log('WeakMap: 对象键映射，弱引用，不可迭代，适合私有数据存储');