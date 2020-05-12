
/**
 * 计算指定数值范围内的斐波那切数列总和
 * 递归实现
 * @param {number} num 
 */
function getNum(num) {
    if(num<2){
        return 1;
    }

    return getNum(num-2) + getNum(num-1);
}

console.log('num 10:', getNum(10))