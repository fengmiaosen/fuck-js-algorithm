
function oneChar(str) {
    let map = new Map()

    for (let c of str) {
        if (map.has(c)) {
            map.set(c, map.get(c) + 1)
        } else {
            map.set(c, 1)
        }
    }

    for(let [k,v] of map){
        if(map.get(k) === 1){
            return k
        }
    }
}

console.log(oneChar('abaccdeff'))
console.log(oneChar('xxxabaccbqdeff'))
