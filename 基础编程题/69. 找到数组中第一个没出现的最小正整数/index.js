// 给你一个未排序的整数数组 nums ，请你找出其中没有出现的最小的正整数。
// 请你实现时间复杂度为 O(n) 并且只使用常数级别额外空间的解决方案。

// 示例 1：

// 输入：nums = [1,2,0]
// 输出：3

// 示例 2：

// 输入：nums = [3,4,-1,1]
// 输出：2

// 示例 3：

// 输入：nums = [7,8,9,11,12]
// 输出：1

// https://leetcode.cn/problems/first-missing-positive/

// 时间空间均为 O(n)
const firstMissingPositive = (nums) => {
    const set = new Set();
    for (let i = 0; i < nums.length; i++) {
        set.add(nums[i]);
    }
    for (let i = 1; i <= nums.length + 1; i++) {
        if (!set.has(i)) {
            return i;
        }
    }
};

// 时间复杂度为 O(n) 并且只使用常数级别空间
const firstMissingPositive2 = (nums) => {
    for (let i = 0; i < nums.length; i++) {
      while (
        nums[i] >= 1 &&
        nums[i] <= nums.length && // 对1~nums.length范围内的元素进行安排
        nums[nums[i] - 1] !== nums[i] // 已经出现在理想位置的，就不用交换
      ) {
        const temp = nums[nums[i] - 1]; // 交换
        nums[nums[i] - 1] = nums[i];
        nums[i] = temp;
      }
    }
    // 现在期待的是 [1,2,3,...]，如果遍历到不是放着该放的元素
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] != i + 1) {
        return i + 1;
      }
    }
    return nums.length + 1; // 发现元素 1~nums.length 占满了数组，一个没缺
  };

console.log(firstMissingPositive([3, 4, -1, 1]))

console.log(firstMissingPositive2([3, 4, -1, 1]))
