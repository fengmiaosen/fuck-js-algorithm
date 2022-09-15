//IP转成整型
function ip2int(ip) {
    var num = 0;
    ip = ip.split(".");

    num = Number(ip[0]) * 256 * 256 * 256 +
        Number(ip[1]) * 256 * 256 +
        Number(ip[2]) * 256 +
        Number(ip[3]);

    num = num >>> 0;

    return num;
}

console.log('ip to num:', ip2int('127.0.0.1'));
