var obj = { 1: 222, 2: 123, 5: 888 };

function fn(obj) {

    return Array.from({ length: 12 }).map((item, index) => {
        return obj[index + 1] || null;
    })
}

console.log('result:', fn(obj));