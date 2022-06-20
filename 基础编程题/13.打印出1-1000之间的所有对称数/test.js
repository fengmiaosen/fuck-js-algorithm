
function fn() {

    const res = []

    for (let i = 0; i <= 1000; i++) {
        const str = i.toString()
        const str2 = str.split('').reverse().join('')

        if(str === str2){
            res.push(Number(str));
        }
    }

    return res;
}

console.log(JSON.stringify(fn()))