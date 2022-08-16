
// 入参格式参考：

// const url = 'http://sample.com/?a=1&b=2&c=xx&d=#hash';
// 出参格式参考：

// const result = { a: '1', b: '2', c: 'xx', d: '' };
// // 拆解URL参数中queryString，返回一个 key - value 形式的 object

/**
 * 
 * @param {string} url 
 */
function parseQuery(url) {
    let urlObj = new URL(url)
    // console.log('urlObj:', urlObj)

    let queryObj = {}
    for (let [k, v] of urlObj.searchParams) {
        queryObj[k] = v
    }

    return queryObj
}

const url = 'http://sample.com/?a=1&b=2&c=xx&d=#hash';
console.log(parseQuery(url))