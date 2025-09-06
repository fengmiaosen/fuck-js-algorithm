/**
 * 数字字符串相乘
 * @param {string} num1 
 * @param {string} num2 
 */
function multiply(num1, num2) {

    if (num1 == 0 || num2 == 0) {
        return '0';
    }

    let m = num1.length;
    let n = num2.length;

    //结果数组最大长度为 m+n，注意未填满的位置为0
    let res = new Array(m + n).fill(0);

    // 倒序从个位数对每个字符串（数字）做乘法，同时注意进位
    // a[i],b[j]相乘的结果影响res[i+j], res[i+j+1]
    for (let i = m - 1; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
            let value = (+num1[i]) * (+num2[j]);

            //乘积在res中的位置
            let highIdx = i + j;
            let lowIdx = i + j + 1;

            let sum = res[lowIdx] + value;

            //低位数
            res[lowIdx] = sum % 10;

            // 高位数
            res[highIdx] = res[highIdx] + parseInt(sum / 10);
        }
    }

    // 跳过结果数组前面的0
    let strs = [];

    for (let k = 0; k < res.length; k++) {
        if (k == 0 && res[k] == 0) {
            continue;
        }
        strs.push(res[k]);
    }

    return strs.join('');

};
