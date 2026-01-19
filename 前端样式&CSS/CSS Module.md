
CSS Modules 是一种 CSS 组织和管理的方式，旨在解决传统 CSS 中样式冲突和全局命名的问题。以下是 CSS Modules 的主要特点和优点：

### 1. **作用域隔离**

- **局部作用域**：CSS Modules 默认将每个样式类名局部化，避免全局命名冲突。每个类名都被转译为一个唯一的字符串。
  
### 2. **自动命名**

- **动态生成类名**：当你在 CSS 模块中定义一个类时，编译时会自动生成一个唯一的类名。例如，`.button` 可能会被转译为 `Button_button__1a2b3`。

### 3. **简单的导入和使用**

- **模块化导入**：可以通过 JavaScript 导入 CSS 模块，并使用对象的属性来访问样式。例如：
  ```javascript
  import styles from './Button.module.css';
  
  const Button = () => {
    return <button className={styles.button}>Click Me</button>;
  };
  ```

### 4. **兼容性**

- **与现有工具兼容**：CSS Modules 可以与现有的构建工具（如 Webpack、Parcel 等）集成，通常只需少量配置。

### 5. **支持预处理器**

- **与预处理器结合使用**：CSS Modules 可以与 SASS、LESS 等 CSS 预处理器结合，支持更复杂的样式编写。

### 6. **优点**

- **避免样式冲突**：由于类名是局部作用域的，减少了样式冲突的可能性。
- **更好的可维护性**：模块化的样式使得代码更加清晰，易于维护。
- **增强的可读性**：通过将样式与组件紧密结合，增强了代码的可读性。

### 7. **示例**

假设有一个 `Button.module.css` 文件：

```css
.button {
  background-color: blue;
  color: white;
}
```

在组件中使用：

```javascript
import styles from './Button.module.css';

const Button = () => {
  return <button className={styles.button}>Click Me</button>;
};
```

### 总结

CSS Modules 是一种有效的管理 CSS 的方法，特别适合大型应用和组件化开发。它通过局部作用域和自动命名来解决传统 CSS 的一些问题，提高了样式的可维护性和可读性。

* [CSS Modules](https://github.com/css-modules/css-modules)