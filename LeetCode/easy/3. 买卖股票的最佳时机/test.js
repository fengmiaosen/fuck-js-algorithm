// 给定一个数组，它的第 i 个元素是一支给定股票第 i 天的价格。
// 如果你最多只允许完成一笔交易（即买入和卖出一支股票一次），设计一个算法来计算你所能获取的最大利润。

/**
 * 
 * @param {array} nums 
 */
function maxProfit(nums) {
    let miniPrice = Number.MAX_VALUE
    let maxDiff = 0

    for (let num of nums) {
        miniPrice = Math.min(miniPrice, num)
        maxDiff = Math.max(maxDiff, num - miniPrice)
    }

    return maxDiff
}

const nums = [7, 1, 5, 3, 6, 4];

console.log('max profit:', maxProfit(nums))