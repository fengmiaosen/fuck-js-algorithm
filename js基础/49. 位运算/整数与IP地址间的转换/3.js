// 参考 https://www.cnblogs.com/whyoop/p/3140803.html
// javascript把IP地址转为数值几种方案，来挑战一下效率吧

// IP地址的验证，
var REG = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

function ipToInt(ip) {
    var xH = "", result = REG.exec(ip);

    if (!result) return -1;

    for (var i = 1; i <= 4; i++) {
        var h = parseInt(result[i]);
        xH += (h > 15 ? "" : "0") + h.toString(16);
    }
    return parseInt(xH, 16);
}

console.log('ip to num:', ipToInt('127.0.0.1'));
