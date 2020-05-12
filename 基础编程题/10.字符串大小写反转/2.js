
function convertString(str) {

    const res = [];

    for (let i = 0; i < str.length; i++) {
        const char = str[i].toUpperCase() === str[i] ?
            str[i].toLowerCase() :
            str[i].toUpperCase();

        res.push(char)
    }

    return res.join('');
}

let str = 'aBcDE';

console.log('str:', convertString(str))