在 JavaScript 中，可以使用多种方法循环遍历对象。以下是一些常见的方法：

### 1. **`for...in` 循环**
`for...in` 循环用于遍历对象的所有可枚举属性（包括继承的属性）。

```javascript
const obj = { a: 1, b: 2, c: 3 };

for (const key in obj) {
    if (obj.hasOwnProperty(key)) { // 检查属性是否为自身属性
        console.log(key, obj[key]);
    }
}
```

### 2. **`Object.keys()`**
`Object.keys()` 方法返回一个包含对象自身可枚举属性名的数组，可以结合 `forEach` 循环使用。

```javascript
const obj = { a: 1, b: 2, c: 3 };

Object.keys(obj).forEach(key => {
    console.log(key, obj[key]);
});
```

### 3. **`Object.values()`**
`Object.values()` 返回一个包含对象自身可枚举属性值的数组。

```javascript
const obj = { a: 1, b: 2, c: 3 };

Object.values(obj).forEach(value => {
    console.log(value);
});
```

### 4. **`Object.entries()`**
`Object.entries()` 返回一个包含对象自身可枚举属性 `[key, value]` 对的数组。

```javascript
const obj = { a: 1, b: 2, c: 3 };

Object.entries(obj).forEach(([key, value]) => {
    console.log(key, value);
});
```

### 5. **`forEach` 与 `Map`**
如果对象的键是字符串或符号，可以将其转换为 `Map` 对象，然后使用 `forEach`。

```javascript
const obj = { a: 1, b: 2, c: 3 };
const map = new Map(Object.entries(obj));

map.forEach((value, key) => {
    console.log(key, value);
});
```

### 总结
以上方法可以根据你的需求选择使用。`for...in` 适合遍历所有可枚举属性，而 `Object.keys()`、`Object.values()` 和 `Object.entries()` 提供了更灵活的方式来操作对象的属性。