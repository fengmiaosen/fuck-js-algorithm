function reverseStr(str) {
    var res = [];

    for (const char of str) {
        var s = char.toLocaleUpperCase() === char ?
            char.toLocaleLowerCase() :
            char.toLocaleUpperCase();

        res.push(s);
    }

    return res.join('');
}

// 优化性能的新函数
function reverseStrFast(str) {
    // 直接操作字符串，避免数组push和join
    let result = '';
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        // 只处理英文字母，其他字符直接拼接
        if (code >= 65 && code <= 90) {
            // 大写转小写
            result += String.fromCharCode(code + 32);
        } else if (code >= 97 && code <= 122) {
            // 小写转大写
            result += String.fromCharCode(code - 32);
        } else {
            result += str[i];
        }
    }
    return result;
}

var str = 'AbCdE';
console.log('reverse str:', reverseStr(str));
console.log('reverse str fast:', reverseStrFast(str));