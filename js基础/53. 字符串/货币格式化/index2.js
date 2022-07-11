// https://blog.csdn.net/qq_36279445/article/details/78889305


function convert(str) {
    // 先行断言 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions#special-lookahead
    //(?=p)，其中 p 是一个子模式，即 p 前面的位置，或者说，该位置后面的字符要匹配 p
    // $& 表示整个用于匹配的原字符串
    return str.replace(/\d(?=(\d{3})+$)/g, `$&,`)
}

// https://wenjun.me/2020/12/formatting-currency-via-regexp.html
function convert2(str) {
    return str.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

function convert3(str) {
    return new Intl.NumberFormat().format(parseInt(str))
}

function convert4(num){
    return num.toLocaleString('en-US')
}


console.log(convert('999999988'));
console.log(convert2('999999988'));

console.log('intl format:', convert3('999999988'));
console.log('locale format:', convert4(999999988));

