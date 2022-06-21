// 比如有个数组有100K个元素，从中不重复随机选取10K个元素

const max_length = 100000;
const source = Array.from({ length: max_length }).map((item, i) => i);

/**
 * 
 * @param {*} source 
 * @param {*} length 
 */
function func(source, length) {

    const keys = new Set();
    
    while (keys.size < length) {
        keys.add(Math.floor(Math.random() * max_length));
    }

    const result = [];

    for(let key of keys){
        result.push(source[key]);
    }

    return result;
}

console.time('array');

const result = func(source, 100);

console.timeEnd('array');

console.log('random array:', result);