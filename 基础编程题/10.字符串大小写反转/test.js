
function convertString(str) {

    const res = []

    for(const char of str){
        if(char.toLowerCase() === char){
            res.push(char.toUpperCase())
        }else{
            res.push(char.toLowerCase())
        }
    }

    return res.join('');
}

let str = 'aBcDEf';

console.log('str:', convertString(str))