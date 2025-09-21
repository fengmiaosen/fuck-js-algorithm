/**
 * 
 * @param {string} str 字符串
 */
/**
 * Time Complexity: O(n^3)
 * - Outer loop: O(n)
 * - Inner loop: O(n) 
 * - isPalindrome check: O(n)
 * - substring operation: O(n)
 * 
 * Space Complexity: O(n)
 * - substring operation creates new string of max length n
 */
function countSubstrings(str) {
    let res = 0

    for (let i = 0; i < str.length; i++) {
        for (let j = i; j < str.length; j++) {
            if (isPalindrome(str.substring(i, j + 1))) {
                res++
            }
        }
    }

    return res
}

function isPalindrome(str) {
    let left = 0
    let right = str.length - 1

    while (left < right) {
        if (str[left] != str[right]) {
            return false
        }
        left++
        right--
    }
    return true
}

/**
 * 
 * @param {string} str 字符串
 * @returns {number} 回文子串数量
 */
function countSubstrings2(str) {
    let res = 0

    for (let i = 0; i < str.length; i++) {
        for (let j = i; j < str.length; j++) {
            if (isPalindrome2(str, i, j)) {
                res++
            }
        }
    }

    return res
}

/**
 * 
 * @param {string} str 字符串
 * @param {number} left 左指针
 * @param {number} right 右指针
 * @returns {boolean} 是否为回文子串
 */
function isPalindrome2(str, left, right) {
    while (left < right) {
        if (str[left] != str[right]) {
            return false
        }
        left++
        right--
    }
    return true
}


// Test case 1: Empty string
console.log(countSubstrings("")) // Expected: 0

// Test case 2: Single character
console.log(countSubstrings("x")) // Expected: 1

// Test case 3: String with repeating characters
console.log(countSubstrings("aaaa")) // Expected: 10

// Test case 4: String with mixed characters
console.log(countSubstrings("racecar")) // Expected: 10

// Test case 5: String with special characters
console.log(countSubstrings("!@#@!")) // Expected: 7

console.log('test111===')
// Test the second implementation
console.log(countSubstrings("")) // Expected: 0
console.log(countSubstrings("x")) // Expected: 1
console.log(countSubstrings("aaaa")) // Expected: 10
console.log(countSubstrings("racecar")) // Expected: 10
console.log(countSubstrings("!@#@!")) // Expected: 7


console.log('test222===') // Expected: 0
console.log(countSubstrings2("")) // Expected: 0
console.log(countSubstrings2("x")) // Expected: 1
console.log(countSubstrings2("aaaa")) // Expected: 10
console.log(countSubstrings2("racecar")) // Expected: 10
console.log(countSubstrings2("!@#@!")) // Expected: 7