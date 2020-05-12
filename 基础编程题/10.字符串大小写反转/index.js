function reverseStr(str){
    var res = [];

    for(const char of str){
        var s = char.toLocaleUpperCase() === char ? char.toLocaleLowerCase() : char.toLocaleUpperCase();

        res.push(s);
    }

    return res.join('');
}

var str = 'AbCdE';
console.log('reverse str:', reverseStr(str));