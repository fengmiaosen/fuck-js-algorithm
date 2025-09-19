Canvas Context 的 `save()` 和 `restore()` 是管理绘图状态的重要方法，让我详细解释它们的工作原理和应用场景：

## 基本概念

`save()` 和 `restore()` 使用栈（Stack）数据结构来管理 Canvas 的绘图状态：

- `save()`：将当前绘图状态压入栈顶
- `restore()`：从栈顶弹出绘图状态并应用

## 保存的状态包括什么

以下绘图状态会被 `save()` 保存：

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 这些属性都会被 save() 保存
ctx.fillStyle = '#ff0000';        // 填充样式
ctx.strokeStyle = '#00ff00';      // 描边样式
ctx.lineWidth = 5;                // 线条宽度
ctx.lineCap = 'round';           // 线条端点样式
ctx.lineJoin = 'round';          // 线条连接样式
ctx.globalAlpha = 0.5;           // 全局透明度
ctx.globalCompositeOperation = 'multiply'; // 合成操作
ctx.font = '20px Arial';         // 字体
ctx.textAlign = 'center';        // 文本对齐
ctx.shadowColor = '#000';        // 阴影颜色
ctx.shadowBlur = 10;             // 阴影模糊度
ctx.shadowOffsetX = 5;           // 阴影X偏移
ctx.shadowOffsetY = 5;           // 阴影Y偏移

// 变换矩阵状态
ctx.translate(100, 100);         // 平移
ctx.rotate(Math.PI / 4);         // 旋转
ctx.scale(2, 2);                 // 缩放

// 裁剪路径
ctx.beginPath();
ctx.rect(0, 0, 100, 100);
ctx.clip();
```

## 基础使用示例

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 初始状态
ctx.fillStyle = 'blue';
ctx.fillRect(10, 10, 50, 50);

// 保存当前状态
ctx.save();

// 修改状态
ctx.fillStyle = 'red';
ctx.translate(100, 0);
ctx.fillRect(10, 10, 50, 50);

// 恢复之前保存的状态
ctx.restore();

// 此时 fillStyle 回到 'blue'，translate 也被重置
ctx.fillRect(70, 10, 50, 50); // 绘制蓝色矩形
```

## 嵌套使用

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'black';

// 第一层 save
ctx.save();
ctx.fillStyle = 'red';
ctx.translate(50, 50);

  // 第二层 save
  ctx.save();
  ctx.fillStyle = 'blue';
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(0, 0, 30, 30); // 蓝色旋转矩形
  
  // 恢复到第一层状态
  ctx.restore(); // fillStyle='red', 有translate, 无rotate
  ctx.fillRect(0, 0, 30, 30); // 红色矩形

// 恢复到初始状态
ctx.restore(); // fillStyle='black', 无transform
ctx.fillRect(0, 0, 30, 30); // 黑色矩形
```

## 实际应用场景

### 1. 绘制复杂图形时保护状态

```javascript
function drawComplexShape(ctx, x, y) {
    ctx.save(); // 保护调用前的状态
    
    // 设置特定的绘图状态
    ctx.translate(x, y);
    ctx.fillStyle = 'purple';
    ctx.strokeStyle = 'orange';
    ctx.lineWidth = 3;
    
    // 绘制复杂图形
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.restore(); // 恢复调用前的状态
}

// 使用时不会影响后续绘制
ctx.fillStyle = 'green';
drawComplexShape(ctx, 100, 100);
// 此时 fillStyle 仍然是 'green'
```

### 2. 动画中的状态管理

```javascript
function animateRotatingSquares(ctx, time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < 5; i++) {
        ctx.save();
        
        // 每个方块不同的位置和旋转
        ctx.translate(100 + i * 80, 200);
        ctx.rotate(time * 0.01 + i * 0.5);
        
        // 绘制旋转的方块
        ctx.fillStyle = `hsl(${i * 60}, 70%, 50%)`;
        ctx.fillRect(-25, -25, 50, 50);
        
        ctx.restore();
    }
    
    requestAnimationFrame((newTime) => animateRotatingSquares(ctx, newTime));
}
```

### 3. 递归绘制（如分形图案）

```javascript
function drawFractalTree(ctx, length, angle, depth) {
    if (depth === 0) return;
    
    ctx.save();
    
    // 绘制树干
    ctx.strokeStyle = `hsl(${120 - depth * 20}, 70%, ${30 + depth * 10}%)`;
    ctx.lineWidth = depth;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -length);
    ctx.stroke();
    
    // 移动到树干顶端
    ctx.translate(0, -length);
    
    // 绘制左分支
    ctx.save();
    ctx.rotate(-angle);
    drawFractalTree(ctx, length * 0.7, angle, depth - 1);
    ctx.restore();
    
    // 绘制右分支
    ctx.save();
    ctx.rotate(angle);
    drawFractalTree(ctx, length * 0.7, angle, depth - 1);
    ctx.restore();
    
    ctx.restore();
}

// 使用
ctx.save();
ctx.translate(canvas.width / 2, canvas.height - 50);
drawFractalTree(ctx, 100, Math.PI / 6, 8);
ctx.restore();
```

### 4. 多图层绘制

```javascript
function drawLayeredScene(ctx) {
    // 背景层
    ctx.save();
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    // 云朵层
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = 'white';
    drawClouds(ctx);
    ctx.restore();
    
    // 建筑物层
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;
    drawBuildings(ctx);
    ctx.restore();
    
    // 前景层
    ctx.save();
    ctx.globalAlpha = 0.9;
    drawTrees(ctx);
    ctx.restore();
}
```

## 性能优化技巧

### 1. 避免不必要的 save/restore

```javascript
// 不好的做法
function drawShape(ctx, x, y, color) {
    ctx.save(); // 每次都保存
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 50, 50);
    ctx.restore(); // 每次都恢复
}

// 更好的做法
function drawShapes(ctx, shapes) {
    const originalFillStyle = ctx.fillStyle;
    
    shapes.forEach(shape => {
        ctx.fillStyle = shape.color;
        ctx.fillRect(shape.x, shape.y, 50, 50);
    });
    
    ctx.fillStyle = originalFillStyle; // 只在最后恢复
}
```

### 2. 批量操作

```javascript
function drawGrid(ctx, rows, cols) {
    ctx.save();
    
    // 设置一次网格样式
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    
    // 批量绘制所有线条
    for (let i = 0; i <= rows; i++) {
        ctx.moveTo(0, i * 20);
        ctx.lineTo(cols * 20, i * 20);
    }
    
    for (let j = 0; j <= cols; j++) {
        ctx.moveTo(j * 20, 0);
        ctx.lineTo(j * 20, rows * 20);
    }
    
    ctx.stroke();
    ctx.restore();
}
```

## 常见错误和注意事项

### 1. save/restore 不匹配

```javascript
// 错误：save 比 restore 多
ctx.save();
ctx.save();
ctx.fillStyle = 'red';
ctx.restore(); // 只有一个 restore

// 错误：restore 比 save 多
ctx.save();
ctx.fillStyle = 'red';
ctx.restore();
ctx.restore(); // 多余的 restore，可能导致错误
```

### 2. 忘记恢复状态

```javascript
function drawTemporaryEffect(ctx) {
    ctx.save(); // 保存状态
    
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = 'yellow';
    // ... 绘制特效
    
    // 忘记 ctx.restore()，导致后续绘制都受影响
}
```

## 调试技巧

```javascript
// 添加状态跟踪
function debugSave(ctx, label) {
    console.log(`Save: ${label}`);
    ctx.save();
}

function debugRestore(ctx, label) {
    console.log(`Restore: ${label}`);
    ctx.restore();
}

// 使用
debugSave(ctx, 'before drawing circle');
ctx.fillStyle = 'red';
ctx.arc(100, 100, 50, 0, Math.PI * 2);
ctx.fill();
debugRestore(ctx, 'after drawing circle');
```

理解 `save()` 和 `restore()` 的核心是把它们看作状态管理工具，就像编程中的作用域一样。它们让你可以安全地修改绘图状态，而不用担心影响到其他代码的绘制效果。

### canvas绘制

* [理解Canvas Context 的save() 和 restore()](https://juejin.cn/post/6844903879599996942)
* [小tip: SVG和Canvas分别实现图片圆角效果](https://www.zhangxinxu.com/wordpress/2014/06/svg-canvas-image-border-radius/)
* [canvas绘制海报01：绘制图片及解决清晰度](https://juejin.cn/post/6844904130750726158)
* [canvas绘制海报02： 绘制圆角图片](https://juejin.cn/post/6844904167983562760)
* [canvas实现圆框图片](https://www.jianshu.com/p/9a6ee2648d6f)
