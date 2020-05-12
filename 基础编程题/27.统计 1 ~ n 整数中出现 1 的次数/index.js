// 方法一
function findOne(n){

    let count = 0;

    for(let i=0;i<n;i++){
        let num = i.toString().split('').filter(item => item === '1').length;
        count = count + num;
    }

    return count;
}


// 方法二


const num = findOne(100);

console.log('num 1:', num);