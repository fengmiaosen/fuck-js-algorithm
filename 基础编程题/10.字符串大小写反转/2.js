
function convertString(str) {

    let res = '';

    for (let i = 0; i < str.length; i++) {
        const char = str[i].toUpperCase() === str[i] ?
            str[i].toLowerCase() :
            str[i].toUpperCase();

        res = res + char;
    }

    return res;
}

let str = 'aBcDE';

console.log('str:', convertString(str))