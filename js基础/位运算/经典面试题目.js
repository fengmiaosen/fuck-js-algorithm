// 位运算经典面试题目 - JavaScript实现

// ===== 1. 只出现一次的数字 =====
// 题目：给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现一次的元素。
// LeetCode 136
function singleNumber(nums) {
    // 利用异或运算的特性：a ^ a = 0, a ^ 0 = a
    return nums.reduce((a, b) => a ^ b, 0);
}

// 测试
console.log('只出现一次的数字:', singleNumber([2, 2, 1])); // 1
console.log('只出现一次的数字:', singleNumber([4, 1, 2, 1, 2])); // 4

// ===== 2. 两个整数之间的汉明距离 =====
// 题目：计算两个整数之间的汉明距离（对应位不同的位数）
// LeetCode 461
function hammingDistance(x, y) {
    let xor = x ^ y;  // 异或得到不同的位
    let count = 0;
    
    // 计算异或结果中1的个数
    while (xor) {
        count++;
        xor &= (xor - 1);  // 清除最低位的1
    }
    return count;
}

// 测试
console.log('汉明距离:', hammingDistance(1, 4)); // 2 (001 ^ 100 = 101，有2个1)

// ===== 3. 颠倒二进制位 =====
// 题目：颠倒给定的32位无符号整数的二进制位
// LeetCode 190
function reverseBits(n) {
    let result = 0;
    for (let i = 0; i < 32; i++) {
        result = (result << 1) | (n & 1);  // 将n的最低位加到result的最低位
        n >>= 1;  // n右移一位
    }
    return result >>> 0;  // 确保返回无符号整数
}

// 测试
console.log('颠倒二进制位:', reverseBits(43261596)); // 964176192

// ===== 4. 不用加减乘除做加法 =====
// 题目：写一个函数，求两个整数之和，要求不得使用+、-、*、/四则运算符号
// 剑指Offer 65
function add(a, b) {
    while (b !== 0) {
        const carry = (a & b) << 1;  // 计算进位
        a = a ^ b;  // 计算无进位的和
        b = carry;  // 将进位赋给b
    }
    return a;
}

// 测试
console.log('不用加法做加法:', add(1, 2)); // 3
console.log('不用加法做加法:', add(5, 7)); // 12

// ===== 5. 数字范围按位与 =====
// 题目：给定范围[m, n]，返回此范围内所有数字的按位与
// LeetCode 201
function rangeBitwiseAnd(m, n) {
    let shift = 0;
    // 找到m和n的公共前缀
    while (m !== n) {
        m >>= 1;
        n >>= 1;
        shift++;
    }
    return m << shift;
}

// 测试
console.log('数字范围按位与:', rangeBitwiseAnd(5, 7)); // 4

// ===== 6. 计算二进制中1的个数 =====
// 题目：编写一个函数，输入是一个无符号整数，返回其二进制表达式中数字位数为 '1' 的个数
// LeetCode 191
function hammingWeight(n) {
    let count = 0;
    while (n) {
        count++;
        n &= (n - 1);  // 清除最低位的1
    }
    return count;
}

// 测试
console.log('二进制中1的个数:', hammingWeight(11)); // 3 (1011有3个1)

// ===== 7. 判断是否为2的幂 =====
// 题目：给定一个整数，编写一个函数来判断它是否是 2 的幂次方
// LeetCode 231
function isPowerOfTwo(n) {
    return n > 0 && (n & (n - 1)) === 0;
}

// 测试
console.log('是否为2的幂:', isPowerOfTwo(1)); // true (2^0)
console.log('是否为2的幂:', isPowerOfTwo(16)); // true (2^4)
console.log('是否为2的幂:', isPowerOfTwo(218)); // false

// ===== 8. 只出现一次的数字 II =====
// 题目：给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现了三次。找出那个只出现一次的元素。
// LeetCode 137
function singleNumberII(nums) {
    let ones = 0, twos = 0;
    
    for (let num of nums) {
        ones = (ones ^ num) & (~twos);
        twos = (twos ^ num) & (~ones);
    }
    
    return ones;
}

// 测试
console.log('只出现一次的数字II:', singleNumberII([2, 2, 3, 2])); // 3

// ===== 9. 找不同 =====
// 题目：给定两个字符串 s 和 t，它们只包含小写字母。字符串 t 由字符串 s 随机重排，然后在随机位置添加一个字母。找出在 t 中被添加的字母。
// LeetCode 389
function findTheDifference(s, t) {
    let result = 0;
    
    // 对所有字符进行异或运算
    for (let char of s) {
        result ^= char.charCodeAt(0);
    }
    for (let char of t) {
        result ^= char.charCodeAt(0);
    }
    
    return String.fromCharCode(result);
}

// 测试
console.log('找不同:', findTheDifference("abcd", "abcde")); // "e"

// ===== 10. 缺失数字 =====
// 题目：给定一个包含 [0, n] 中 n 个数的数组 nums ，找出 [0, n] 这个范围内没有出现在数组中的那个数。
// LeetCode 268
function missingNumber(nums) {
    let result = nums.length;
    
    for (let i = 0; i < nums.length; i++) {
        result ^= i ^ nums[i];
    }
    
    return result;
}

// 测试
console.log('缺失数字:', missingNumber([3, 0, 1])); // 2

// ===== 11. 最大单词长度乘积 =====
// 题目：给定一个字符串数组 words，找到 length(word[i]) * length(word[j]) 的最大值，并且这两个单词不含有公共字母。
// LeetCode 318
function maxProduct(words) {
    const n = words.length;
    const masks = new Array(n);
    
    // 为每个单词创建位掩码
    for (let i = 0; i < n; i++) {
        let mask = 0;
        for (let char of words[i]) {
            mask |= 1 << (char.charCodeAt(0) - 'a'.charCodeAt(0));
        }
        masks[i] = mask;
    }
    
    let maxProd = 0;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if ((masks[i] & masks[j]) === 0) {  // 没有公共字母
                maxProd = Math.max(maxProd, words[i].length * words[j].length);
            }
        }
    }
    
    return maxProd;
}

// 测试
console.log('最大单词长度乘积:', maxProduct(["abcw", "baz", "foo", "bar", "xtfn", "abcdef"])); // 16

// ===== 12. 比特位计数 =====
// 题目：给定一个非负整数 num。对于 0 ≤ i ≤ num 范围中的每个数字 i ，计算其二进制数中的 1 的数目并将它们作为数组返回。
// LeetCode 338
function countBits(n) {
    const result = new Array(n + 1);
    result[0] = 0;
    
    for (let i = 1; i <= n; i++) {
        // result[i] = result[i >> 1] + (i & 1)
        // 或者使用 Brian Kernighan 算法
        result[i] = result[i & (i - 1)] + 1;
    }
    
    return result;
}

// 测试
console.log('比特位计数:', countBits(5)); // [0,1,1,2,1,2]

// ===== 实用工具函数 =====

// 判断奇偶性
function isOdd(n) {
    return (n & 1) === 1;
}

// 交换两个数（不使用临时变量）
function swap(a, b) {
    console.log(`交换前: a=${a}, b=${b}`);
    a = a ^ b;
    b = a ^ b;
    a = a ^ b;
    console.log(`交换后: a=${a}, b=${b}`);
    return [a, b];
}

// 求绝对值
function abs(n) {
    const mask = n >> 31;  // 获取符号位
    return (n + mask) ^ mask;
}

// 找到最低位的1
function lowestBit(n) {
    return n & (-n);
}

// 快速乘以2的幂
function multiplyByPowerOfTwo(n, power) {
    return n << power;
}

// 快速除以2的幂
function divideByPowerOfTwo(n, power) {
    return n >> power;
}

// 测试工具函数
console.log('\n===== 工具函数测试 =====');
console.log('5是奇数:', isOdd(5)); // true
console.log('4是奇数:', isOdd(4)); // false
swap(5, 10);
console.log('-5的绝对值:', abs(-5)); // 5
console.log('12的最低位1:', lowestBit(12)); // 4 (12 = 1100, 最低位1在第3位，值为4)
console.log('5乘以2^3:', multiplyByPowerOfTwo(5, 3)); // 40
console.log('40除以2^3:', divideByPowerOfTwo(40, 3)); // 5