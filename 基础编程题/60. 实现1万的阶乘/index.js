
// 方法一：递归调用
// Js中最大的安全整数为2^53- 1，10000!结果溢出该范围，代码运行结果为Infinity，无法计算出正确的结果
function factorial(n) {

    if (n <= 1) {
        return 1;
    }

    return n * factorial(n - 1);
}

/**
 * 数字字符串相乘
 * @param {string} num1 
 * @param {string} num2 
 */
function multiply(num1, num2) {

    if (num1 == 0 || num2 == 0) {
        return '0';
    }

    let m = num1.length;
    let n = num2.length;

    //结果数组最大长度为 m+n，注意未填满的位置为0
    let res = new Array(m + n).fill(0);

    // 倒序从个位数对每个字符串（数字）做乘法，同时注意进位
    // a[i],b[j]相乘的结果影响res[i+j], res[i+j+1]
    for (let i = m - 1; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
            let value = (+num1[i]) * (+num2[j]);

            //乘积在res中的位置
            let highIdx = i + j;
            let lowIdx = i + j + 1;

            let sum = res[lowIdx] + value;

            //低位数
            res[lowIdx] = sum % 10;

            // 高位数
            res[highIdx] = res[highIdx] + parseInt(sum / 10);
        }
    }

    // 跳过结果数组前面的0
    let strs = [];

    for (let k = 0; k < res.length; k++) {
        if (k == 0 && res[k] == 0) {
            continue;
        }
        strs.push(res[k]);
    }

    return strs.join('');

};

function longMultiplication(num1, num2) {
  // 检查输入是否为非负整数
  if (!Number.isInteger(num1) || num1 < 0 || !Number.isInteger(num2) || num2 < 0) {
    throw new Error("输入必须是非负整数");
  }

  // 将数字转换为字符串数组，以便从右到左处理每一位
  const str1 = String(num1);
  const str2 = String(num2);
  const arr1 = str1.split('').map(Number);
  const arr2 = str2.split('').map(Number);
  const len1 = arr1.length;
  const len2 = arr2.length;

  // 处理特殊情况：任何数乘以0都等于0
  if (num1 === 0 || num2 === 0) {
    return 0;
  }
  
  // 结果数组的长度最多为两个数位数的和
  const result = new Array(len1 + len2).fill(0);

  // 从右到左遍历第二个乘数的每一位
  for (let i = len2 - 1; i >= 0; i--) {
    let carry = 0; // 进位
    const digit2 = arr2[i]; // 第二个乘数的当前位
    
    // 从右到左遍历第一个乘数的每一位
    for (let j = len1 - 1; j >= 0; j--) {
      const digit1 = arr1[j]; // 第一个乘数的当前位
      
      // 计算当前位乘积，并加上进位
      const product = digit1 * digit2 + carry;
      
      // 将乘积的个位加到结果数组的相应位置
      const sum = product + result[i + j + 1];
      result[i + j + 1] = sum % 10;
      
      // 更新进位
      carry = Math.floor(sum / 10);
    }
    
    // 将最后剩下的进位加到结果数组的最前位置
    result[i] += carry;
  }

  // 移除结果数组开头多余的0（如果有的话）
  let startIndex = 0;
  while (startIndex < result.length - 1 && result[startIndex] === 0) {
    startIndex++;
  }

  // 将数组转换回数字
  return parseInt(result.slice(startIndex).join(''));
}

// 方法二：动态规划 + 字符串相乘（LeetCode 43题）
// 数字转为字符串，利用竖式相乘得到乘积字符串，保存在数组中，最后拼接为字符串输出
function factorial2(n) {

    let dp = [];

    for (let i = 1; i <= n; i++) {
        if (i == 1) {
            dp[i] = '1';
        } else {
            dp[i] = multiply(dp[i - 1], i + '');
        }
    }

    return dp[n];
}

function factorial3(n) {

    let dp = [];

    for (let i = 1; i <= n; i++) {
        if (i == 1) {
            dp[i] = 1;
        } else {
            dp[i] = longMultiplication(dp[i - 1], i);
        }
    }

    return dp[n];
}

// console.log('factorial 1:', factorial(100));

console.log('factorial dp2:', factorial2(10));
console.log('factorial dp3:', factorial3(10));

