var obj = { 1: 222, 2: 123, 5: 888 };

function func(obj) {
    let arr = new Array(12).fill(null);

    Object.keys(obj).map(key => {
        arr[key - 1] = obj[key];
    });

    return arr;
}

console.log('month data:', func(obj));