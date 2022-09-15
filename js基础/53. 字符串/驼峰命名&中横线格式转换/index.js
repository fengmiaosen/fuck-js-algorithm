
/**
 * 中横线转换为驼峰式
 * @param {string} str 
 */
function convert(str) {

    return str.replace(/-\w/g, function (s) {
        console.log('replace s:', s);
        return s.slice(1).toUpperCase()
    })
}

function transform(str) {

    return str.replace(/-(\w)/g, (match, p1) => {
        console.log('match $1:', match, p1)
        return p1.toUpperCase()
    })
}

var str = "get-element-by-id"

console.log(convert(str));

console.log(transform(str));


// 驼峰式转换为中横线
/**
 * 
 * @param {string} str 
 * @returns 
 */
function styleHyphenFormat(str) {
    function upperToHyphenLower(match) {
        return '-' + match.toLowerCase();
    }
    return str.replace(/[A-Z]/g, upperToHyphenLower);
}


console.log(styleHyphenFormat('borderTop'))

// TODO 兼容这种情况
console.log(styleHyphenFormat('BorderTop'))