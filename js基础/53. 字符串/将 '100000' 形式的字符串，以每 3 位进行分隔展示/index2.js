function formatNumber3(str, split = ',') {
    let result = '';
    for (let i = str.length - 1; i >= 0; i--) {
        result = str[i] + result;
        if ((str.length - i) % 3 === 0 && i !== 0) {
            result = split + result;
        }
    }
    return result;
}

console.log(formatNumber3('10000000000', '.')); // "10.000.000.000"
console.log(formatNumber3('10000000000')); // "10.000.000.000"