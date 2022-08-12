function lengthOfLongestSubstring(str) {
    let max = 0
    let map = new Map()

    // 滑动窗口数组左右边界索引
    let i = 0;
    let j = 0;
    
    for (; j < str.length; j++) {
        // 滑动窗口中有重复字符串，收缩左边界，更新索引 i
        if (map.has(str[j])) {
            i = Math.max(map.get(str[j]) + 1, i)
        }
        // 根据滑动窗口数组左右边界计算当前长度，更新当前最大长度数值
        max = Math.max(max, j - i + 1)
        map.set(str[j], j)
    }

    return max
}

console.log(lengthOfLongestSubstring('abcabcbb'))
console.log(lengthOfLongestSubstring('bbbbb'))
console.log(lengthOfLongestSubstring('pwwkew'))
