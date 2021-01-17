
const max_length = 100000;
const arr = Array.from({ length: max_length }).map((item, i) => i);

function getRandomValues(list, length) {
    let keys = new Set()

    while (keys.size < length) {
        const key = Math.floor(Math.random() * list.length)
        keys.add(key)
    }

    const res = []
    for (let key of keys) {
        res.push(list[key])
    }

    return res
}

console.log('random list:', getRandomValues(arr, 10))