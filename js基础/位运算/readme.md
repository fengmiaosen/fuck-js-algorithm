# 位运算核心要点总结

## 1. 基础概念和操作符

### 1.1 什么是位运算
位运算是直接对整数在内存中的二进制位进行操作的运算。JavaScript 中的位运算符会将操作数转换为 32 位有符号整数，然后进行位级操作。

### 1.2 基本位运算符

| 操作符 | 名称 | 描述 | 示例 |
|--------|------|------|------|
| `&` | 按位与 | 两个位都为1时结果为1 | `5 & 3 = 1` (101 & 011 = 001) |
| `|` | 按位或 | 任意一个位为1时结果为1 | `5 | 3 = 7` (101 | 011 = 111) |
| `^` | 按位异或 | 两个位不同时结果为1 | `5 ^ 3 = 6` (101 ^ 011 = 110) |
| `~` | 按位非 | 反转所有位 | `~5 = -6` (~101 = ...11111010) |
| `<<` | 左移 | 向左移动指定位数 | `5 << 1 = 10` (101 << 1 = 1010) |
| `>>` | 有符号右移 | 向右移动，保持符号位 | `5 >> 1 = 2` (101 >> 1 = 10) |
| `>>>` | 无符号右移 | 向右移动，左边补0 | `5 >>> 1 = 2` |

### 1.3 重要特性

1. **异或运算的特性**：
   - `a ^ a = 0`（任何数与自己异或为0）
   - `a ^ 0 = a`（任何数与0异或为自己）
   - 异或满足交换律和结合律

2. **移位运算的特性**：
   - 左移n位相当于乘以2^n
   - 右移n位相当于除以2^n（向下取整）

3. **与运算的特性**：
   - `a & 1` 可以判断奇偶性（结果为1是奇数，为0是偶数）
   - `a & (a-1)` 可以清除最低位的1

## 2. 常见应用场景和技巧

### 2.1 判断奇偶性
```javascript
function isOdd(n) {
    return (n & 1) === 1;
}
```

### 2.2 交换两个数（不使用临时变量）
```javascript
function swap(a, b) {
    a = a ^ b;
    b = a ^ b;
    a = a ^ b;
    return [a, b];
}
```

### 2.3 求绝对值
```javascript
function abs(n) {
    const mask = n >> 31;  // 获取符号位
    return (n + mask) ^ mask;
}
```

### 2.4 判断是否为2的幂
```javascript
function isPowerOfTwo(n) {
    return n > 0 && (n & (n - 1)) === 0;
}
```

### 2.5 计算二进制中1的个数
```javascript
function countOnes(n) {
    let count = 0;
    while (n) {
        count++;
        n &= (n - 1);  // 清除最低位的1
    }
    return count;
}
```

### 2.6 找到最低位的1
```javascript
function lowestBit(n) {
    return n & (-n);
}
```

## 3. 前端面试中的经典位运算题目

### 3.1 只出现一次的数字
**题目**：给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现一次的元素。

**解法**：利用异或运算的特性
```javascript
function singleNumber(nums) {
    return nums.reduce((a, b) => a ^ b, 0);
}
```

### 3.2 两个整数之间的汉明距离
**题目**：计算两个整数之间的汉明距离（对应位不同的位数）。

**解法**：
```javascript
function hammingDistance(x, y) {
    let xor = x ^ y;
    let count = 0;
    while (xor) {
        count++;
        xor &= (xor - 1);
    }
    return count;
}
```

### 3.3 颠倒二进制位
**题目**：颠倒给定的32位无符号整数的二进制位。

**解法**：
```javascript
function reverseBits(n) {
    let result = 0;
    for (let i = 0; i < 32; i++) {
        result = (result << 1) | (n & 1);
        n >>= 1;
    }
    return result >>> 0;  // 确保返回无符号整数
}
```

### 3.4 不用加减乘除做加法
**题目**：写一个函数，求两个整数之和，要求不得使用+、-、*、/四则运算符号。

**解法**：
```javascript
function add(a, b) {
    while (b !== 0) {
        const carry = (a & b) << 1;  // 计算进位
        a = a ^ b;  // 计算无进位的和
        b = carry;  // 将进位赋给b
    }
    return a;
}
```

### 3.5 数字范围按位与
**题目**：给定范围[m, n]，其中0 <= m <= n <= 2147483647，返回此范围内所有数字的按位与。

**解法**：
```javascript
function rangeBitwiseAnd(m, n) {
    let shift = 0;
    while (m !== n) {
        m >>= 1;
        n >>= 1;
        shift++;
    }
    return m << shift;
}
```

## 4. 性能优化应用

### 4.1 快速乘除法
```javascript
// 乘以2的幂
function multiplyByPowerOfTwo(n, power) {
    return n << power;
}

// 除以2的幂
function divideByPowerOfTwo(n, power) {
    return n >> power;
}
```

### 4.2 位掩码（Bitmask）
用于状态管理和权限控制：
```javascript
const PERMISSIONS = {
    READ: 1,    // 001
    WRITE: 2,   // 010
    EXECUTE: 4  // 100
};

function hasPermission(userPermissions, permission) {
    return (userPermissions & permission) === permission;
}

function addPermission(userPermissions, permission) {
    return userPermissions | permission;
}

function removePermission(userPermissions, permission) {
    return userPermissions & (~permission);
}
```

### 4.3 布隆过滤器
```javascript
class BloomFilter {
    constructor(size) {
        this.size = size;
        this.bits = new Array(Math.ceil(size / 32)).fill(0);
    }
    
    add(item) {
        const hash1 = this.hash1(item) % this.size;
        const hash2 = this.hash2(item) % this.size;
        
        this.setBit(hash1);
        this.setBit(hash2);
    }
    
    contains(item) {
        const hash1 = this.hash1(item) % this.size;
        const hash2 = this.hash2(item) % this.size;
        
        return this.getBit(hash1) && this.getBit(hash2);
    }
    
    setBit(index) {
        const arrayIndex = Math.floor(index / 32);
        const bitIndex = index % 32;
        this.bits[arrayIndex] |= (1 << bitIndex);
    }
    
    getBit(index) {
        const arrayIndex = Math.floor(index / 32);
        const bitIndex = index % 32;
        return (this.bits[arrayIndex] & (1 << bitIndex)) !== 0;
    }
}
```

## 5. 注意事项

1. **JavaScript中的位运算限制**：
   - 操作数会被转换为32位有符号整数
   - 超出范围的数字可能产生意外结果

2. **性能考虑**：
   - 位运算通常比算术运算更快
   - 但现代JavaScript引擎优化很好，差异可能不明显

3. **可读性权衡**：
   - 位运算代码通常不如普通代码直观
   - 需要在性能和可读性之间找到平衡

## 6. 总结

位运算是前端开发中的重要技能，特别在以下场景中有用：
- 算法面试题目
- 性能敏感的代码
- 状态管理和权限控制
- 数据压缩和编码
- 图形处理和游戏开发

掌握位运算不仅能帮助你解决复杂的算法问题，还能让你写出更高效的代码。在面试中，位运算题目经常出现，是展示编程功底的好机会。