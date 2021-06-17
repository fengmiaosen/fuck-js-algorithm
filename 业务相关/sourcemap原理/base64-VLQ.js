// Base64 VLQ 源码实现
let charToInteger = {};
let integerToChar = {};

// Base64 和数字互转
'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.split('').forEach(function (char, i) {
    charToInteger[char] = i;
    integerToChar[i] = char;
});

function decode(string) { //Base64 转数字
    let result = [];
    let shift = 0;
    let value = 0;

    for (let i = 0; i < string.length; i++) {
        let integer = charToInteger[string[i]];

        if (integer === undefined) {
            throw new Error(`Invalid character ${string[i]}`)
        }

        const hasContinuationBit = integer & 32; //小于 32 的数跟 32 通过与位运算都是 0

        integer &= 31; // 31 的二进制编码是 11111，相当于取这个数值二进制编码的右五位。
        value += integer << shift; //无符号左移运算，每一位向左移动 n 位，然后在移动前位置补 n 个 0,这个 shift 的值是根据上一个字符决定是否左移，即如果上一个符号的 hasContinuationBit 大于 0，表示这个数值还没有读取完毕，需要继续读取下一个符号的值加起来才是完整值。<< 的优先级比 += 要高，先 << 后 +=。

        if (hasContinuationBit) {
            shift += 5; //左移的位数加 5，因为如果需要分割的时候，后面的字节组都是有 1 个字节表示是否结束，5 个字节表示值，所以左移值是五位。
        } else {
            const shouldNegate = value & 1; //如果读取完毕，判断这个值的二进制的末位是否 1，如果是 1 表明数值是负数，如果是 0 表明数值是正数 
            value >>= 1; //因为最后一位是正负数的记号标识，所以这个值需要右移一位。

            result.push(shouldNegate ? -value : value);

            //reset
            value = shift = 0;
        }
    }

    return result;
}

function encode(value) { //数字转 Base64
    let result;

    if (typeof value === 'number') {
        result = encodeInteger(value);
    } else {
        result = '';
        for (let i = 0; i < value.length; i++) {
            result += encodeInteger(value[i])
        }
    }

    return result;
}

function encodeInteger(num) { //数字转 Base64 核心代码
    let result = '';

    if (num < 0) {
        num = (-num << 1) | 1; //如果要转的数字小于 0，则左移一位，并且将末位变为 1，来标识负数
    } else {
        num <<= 1; //如果要转的数字大于 0，则左移一位，末位自动补 0
    }

    do {
        let clamped = num & 31; //取二进制编码的后五位
        num >>= 5; //然后将数值左移五位

        if (num > 0) { //判断左移后的值是否大于 0，如果还有大于 0 的值，表面该数值还没转完，如果等于 0，表面该数值已完全转为 Base64 字母
            clamped |= 32; //如果进入这个条件语句，表示该数值后还会有值，这组字节组的首个字节一定是 1，所以需要读取的值是六位。通过 |= 跟 32 位运算可以将值变为 6 位二进制值。
        }

        result += integerToChar[clamped];
    } while (num > 0); //左移五位后判断 num 是否大于 0，如果是表明值还没读取完毕，如果不是，结束循环。

    return result;
}
