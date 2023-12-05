
function randomList(list, len) {
    let res = []
    let keys = new Set()
    
    while (keys.size < len) {
        let idx = Math.floor(Math.random() * list.length);
        keys.add(idx)
    }

    for (let key of keys) {
        res.push(list[key])
    }

    return res
}

let list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 130, 4567, 98, 76, 467, 387, 88888, 9999, 27495, 9948];

console.log(randomList(list, 10))