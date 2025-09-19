# 计算对象层级深度

## 问题描述

实现一个函数来计算对象的层级深度，包括递归和非递归两种实现方式。

## 测试用例

```javascript
// [], {} => 1
// [1], { a: 4 } => 2
// undefined, 1, "1" => 0 (非对象类型)
// [{ a: 1 }, { b: 2 }] => 2
// [2, [3, 4]] => 2
```

## 实现方案

### 1. 递归实现

```javascript
function getObjectDepth(obj) {
    if (obj === null || typeof obj !== 'object') {
        return 0;
    }

    let maxDepth = 0;
    for (const key in obj) {
        const depth = getObjectDepth(obj[key]);
        maxDepth = Math.max(maxDepth, depth);
    }

    return maxDepth + 1; // 加1计算当前层级
}
```

**特点：**
- 简洁易懂
- 使用递归调用
- 可能存在栈溢出风险（深度过大时）

### 2. 非递归实现（栈方式）

```javascript
function getObjectDepthIterative(obj) {
    if (obj === null || typeof obj !== 'object') {
        return 0;
    }

    // 使用栈来存储 [对象, 当前深度] 的元组
    const stack = [[obj, 1]];
    let maxDepth = 1;

    while (stack.length > 0) {
        const [currentObj, currentDepth] = stack.pop();
        maxDepth = Math.max(maxDepth, currentDepth);

        // 遍历当前对象的所有属性
        for (const key in currentObj) {
            const value = currentObj[key];
            // 如果值是对象或数组，将其加入栈中，深度+1
            if (value !== null && typeof value === 'object') {
                stack.push([value, currentDepth + 1]);
            }
        }
    }

    return maxDepth;
}
```

**特点：**
- 使用栈模拟递归过程
- 避免栈溢出问题
- 深度优先遍历（DFS）
- 内存使用相对较少

### 3. 非递归实现（队列方式/BFS）

```javascript
function getObjectDepthBFS(obj) {
    if (obj === null || typeof obj !== 'object') {
        return 0;
    }

    // 使用队列来存储当前层的所有对象
    let queue = [obj];
    let depth = 0;

    while (queue.length > 0) {
        depth++;
        const nextQueue = [];
        
        // 处理当前层的所有对象
        for (const currentObj of queue) {
            for (const key in currentObj) {
                const value = currentObj[key];
                // 如果值是对象或数组，将其加入下一层队列
                if (value !== null && typeof value === 'object') {
                    nextQueue.push(value);
                }
            }
        }
        
        queue = nextQueue;
    }

    return depth;
}
```

**特点：**
- 使用队列实现层序遍历
- 广度优先遍历（BFS）
- 逐层处理，更直观
- 在某些情况下内存使用可能较多

## 算法对比

| 特性 | 递归实现 | 栈实现（DFS） | 队列实现（BFS） |
|------|----------|---------------|----------------|
| 时间复杂度 | O(n) | O(n) | O(n) |
| 空间复杂度 | O(d) | O(d) | O(w) |
| 栈溢出风险 | 有 | 无 | 无 |
| 实现难度 | 简单 | 中等 | 中等 |
| 内存使用 | 系统栈 | 手动栈 | 队列 |

**说明：**
- n: 对象中所有节点的总数
- d: 对象的最大深度
- w: 对象某一层的最大宽度

## 测试结果

```
=== 递归版本测试 ===
caseExample: 4
[{ a: 1 }, { b: 2 }]: 2
[2, [3, 4]]: 2
[]: 1
{}: 1
undefined: 0
1: 0
"string": 0

=== 非递归版本（栈）测试 ===
caseExample: 4
[{ a: 1 }, { b: 2 }]: 2
[2, [3, 4]]: 2
[]: 1
{}: 1
undefined: 0
1: 0
"string": 0

=== 非递归版本（队列/BFS）测试 ===
caseExample: 4
[{ a: 1 }, { b: 2 }]: 2
[2, [3, 4]]: 2
[]: 1
{}: 1
undefined: 0
1: 0
"string": 0

=== 复杂对象测试 ===
递归版本: 5
非递归版本（栈）: 5
非递归版本（队列）: 5
```

## 使用场景

### 递归实现
- 对象深度较小的场景
- 代码简洁性要求较高
- 性能要求不是特别严格

### 栈实现（DFS）
- 对象深度可能很大的场景
- 需要避免栈溢出
- 内存使用需要控制

### 队列实现（BFS）
- 需要逐层处理的场景
- 对象宽度较小，深度较大
- 需要了解每一层的结构

## 核心思想

1. **递归思想**：问题可以分解为子问题，当前层级 = max(子对象层级) + 1
2. **栈模拟递归**：使用栈保存待处理的对象和其深度信息
3. **层序遍历**：使用队列逐层处理，每处理完一层深度+1

## 注意事项

1. **边界条件处理**：null、undefined、基本类型的处理
2. **循环引用**：当前实现未处理循环引用，实际使用中可能需要添加visited集合
3. **性能考虑**：对于超大对象，需要考虑内存和时间开销
4. **类型判断**：使用 `typeof obj === 'object' && obj !== null` 来判断对象类型

这三种实现方式各有优劣，可以根据具体的使用场景选择合适的方案。