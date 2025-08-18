// 参考 https://www.cnblogs.com/whyoop/p/3140803.html
// javascript把IP地址转为数值几种方案，来挑战一下效率吧

// IP地址的验证，
var REG = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

function ipToInt(ip) {
    var xH = "", result = REG.exec(ip);

    if (!result) return -1;

    for (var i = 1; i <= 4; i++) {
        var h = parseInt(result[i], 10);
        // ensure each octet is represented by exactly two hex digits
        var hex = h.toString(16);
        if (hex.length === 1) hex = "0" + hex;
        xH += hex;
    }
    // Use Number instead of parseInt to avoid unintended radix inference and to be explicit
    return Number.parseInt(xH, 16);
}

console.log('ip to num:', ipToInt('127.0.0.1'));
