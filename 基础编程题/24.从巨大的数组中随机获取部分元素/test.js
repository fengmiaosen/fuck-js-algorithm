
function randomList(maxLength, len){

    const keys = new Set();

    while(keys.size<len){
        keys.add(Math.floor(Math.random() * maxLength))
    }

    return Array.from(keys);
}

console.log(randomList(1000000, 100))