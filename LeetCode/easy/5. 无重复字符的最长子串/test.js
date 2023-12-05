
function lengthOfLongestSubstring(str) {
    let arr = []
    let max = 0

    for (let i = 0; i < str.length; i++) {
        let index = arr.indexOf(str[i])
        if (index > -1) {
            arr.splice(0, index + 1)
        }
        arr.push(str[i])
        max = Math.max(arr.length, max)
    }

    return max
}

console.log(lengthOfLongestSubstring('abcabcbb'))
console.log(lengthOfLongestSubstring('pwwkew'))
