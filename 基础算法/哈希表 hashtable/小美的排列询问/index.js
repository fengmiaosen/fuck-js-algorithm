/**
 * 小美的排列询问
 * 小美拿到了一个排列，她想知道在这个排列中，y是否是相邻的，你能帮帮她吗？n每个元素恰好出现一次。
 * 输入描述：
 * 第一行输入一个正整数n，表示排列的长度。
 * 第二行输入n个正整数a_i，表示排列的元素。
 * 输出描述：
 * 如果y是相邻的，输出"Yes"，否则输出"No"。
 * 示例1：
 * 输入：
 * 4
 * 1 2 3 4
 * 输出：
 * No
 * 示例2：
 * 输入：
 * 4
 * 1 3 2 4
 * 输出：
 * Yes
 * 说明：
 * 3和2是相邻的。   
 */

/**
 * 判断排列中是否存在相邻的元素（严格含义：是否存在相邻且数值连续、并且是逆序的对：k, k-1）
 * 例如：在 [1, 3, 2, 4] 中，存在相邻的 3 和 2（3,2 为连续整数且顺序为降序），因此返回 "Yes"。
 * 在 [1, 2, 3, 4] 中不存在相邻的 (k, k-1) 对，因此返回 "No"。
 * @param {number} n - 排列的长度
 * @param {number[]} arr - 排列数组
 * @returns {string} - 如果存在相邻的逆序连续整数对返回 "Yes"，否则返回 "No"
 */
function isAdjacent(n, arr) {
  // 检查输入有效性
  if (!Array.isArray(arr) || arr.length !== n) {
    throw new Error('输入数组长度与n不匹配');
  }

  // 核心：检查是否存在相邻的逆序连续整数对，即 arr[i] - arr[i+1] === 1
  for (let i = 0; i < n - 1; i++) {
    if (arr[i] - arr[i + 1] === 1) {
      return "Yes";
    }
  }

  return "No";
}

// 测试示例1 - 按照题目示例1
const n1 = 4;
const arr1 = [1, 2, 3, 4];
console.log(`示例1结果: ${isAdjacent(n1, arr1)}`); // 期望: No

// 测试示例2 - 按照题目示例2
const n2 = 4;
const arr2 = [1, 3, 2, 4];
console.log(`示例2结果: ${isAdjacent(n2, arr2)}`); // 期望: Yes

