// 99999888 => 99,999,888

function formatMoney(value) {

    let len = value.length;

    if (len < 3) {
        return value;
    }

    let start = len % 3 || 3;
    let arr = [value.slice(0, start)];

    while (start < len) {
        arr.push(value.slice(start, start + 3));
        start += 3;
    }

    return arr.join(',');
}

console.log(formatMoney('999999988'));