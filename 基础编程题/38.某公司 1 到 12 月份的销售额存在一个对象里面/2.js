var obj = { 1: 222, 2: 123, 5: 888 };

function fn(obj) {

    return new Array(12).fill(null).map((item, idx) => {
        return obj[idx + 1] || null
    })
}

console.log('result:', fn(obj));