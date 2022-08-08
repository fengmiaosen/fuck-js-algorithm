// 方法二
/*
* 特征规律： 举个栗子先
* 要寻找1～n中有多少个个位数x
* 首先按照位数来推断(只考虑当前位出现x的次数)
* 10中个位出现x的次数是1次（1）
* 100中十位出现x的次数是10次（10-19）
* 1000中百位出现x的次数是100次（100-199）
* 当前位有三种可能（n为当前位数）
* 1.大于x，则为：(左侧数+1)*10^(n-1)
* 2.小于x，则为：左侧数*10^(n-1)
* 3.等于x，则为：左侧数*10^(n-1) + 右侧数
* 
* 假设n=2333， x=1
* 个位：有233个10，个位为3，所以总数为234个
* 十位：有23个100，十位3大于x，2310～2319中为10次，(23+1)*10 = 240
* 百位：有2个1000，百位3大于x，2001～2333中100次（2100～2199总计100次）， 100*2+ 100 = 300
* 千位：有0个10000，千位2大于x, 总计为1000次（1000～1999总计1000次）， 1000
* count = 234 + 240 + 300 + 1000 = 1774
* */
function hasXFromOneToN(n, x) {
    if (x < 0 || x > 9 || n < 0) {
        return 0;
    }
    
    let i = 1, left = n, count = 0;

    while (left != 0) {
        let tmp = parseInt(n / Math.pow(10, i - 1));
        let right = n - tmp * Math.pow(10, i - 1);
        let current = tmp % 10;

        left = parseInt(n / Math.pow(10, i));

        if (current < x) {
            count += left * Math.pow(10, i - 1);
        } else if (current > x) {
            count += (left + 1) * Math.pow(10, i - 1);
        } else {
            count += left * Math.pow(10, i - 1);
            count += (right + 1);
        }
        i++;
    }
    return count;
}

const num2 = hasXFromOneToN(1000);
console.log('num 2:', num2);