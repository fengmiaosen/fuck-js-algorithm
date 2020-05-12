// 打印出1-10000之间的所有对称数，比如121、1331

// 方法一
function symmetry1() {
    let result = [];

    for (let i = 0; i < 10; i++) {
        //  result.push(i);
        result.push(i * 11); //两位数对称数

        for (let j = 0; j < 10; j++) {
            result.push(i * 101 + j * 10);//三位数对称数
            result.push(i * 1001 + j * 110);//四位数对称数
        }
    }

    return result;
}

// 方法二
function symmetry2() {
    let result = [];

    for (let i = 0; i < 10000; i++) {
        var str = i.toString();
        var revStr = str.split('').reverse().join('');

        if(str === revStr){
            result.push(i);
        }
    }

    return result;
}

console.log('对称数1:', symmetry1());

console.log('对称数2:', symmetry2());
