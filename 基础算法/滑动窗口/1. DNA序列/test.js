/**
 * 
 * @param {string} str DNA序列
 * @param {number} len 子串长度
 * @returns {string} 子串
 * @description 找到GC-Ratio最高的子串
 * @example
 * gcMaxRatio('ACGT', 2) // 'CG'
 * gcMaxRatio('AACTGTGCACGACCTGA', 5) // 'GCACG'
 */
function gcMaxRatio(str, len) {
    let max = 0
    let left = 0

    for (let i = 0; i < str.length - len; i++) {
        let count = 0

        for (let j = 0; j < len; j++) {
            if (str[i + j] === 'G' || str[i + j] === 'C') {
                count++
            }
        }

        if (count > max) {
            max = count
            left = i
        }
    }

    return str.substring(left, left + len)
}

// 示例1

// 输入：
// ACGT
// 2
// 输出：
// CG
// 说明：
// ACGT长度为2的子串有AC,CG,GT3个，其中AC和GT 2个的GC-Ratio都为0.5，CG为1，故输出CG   
// 示例2

// 输入：
// AACTGTGCACGACCTGA
// 5
// 输出：
// GCACG
console.log(gcMaxRatio('ACGT', 2))
console.log(gcMaxRatio('AACTGTGCACGACCTGA', 5))