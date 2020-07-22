

function randomSort(nums, len) {
    const keys = new Set();
    const result = [];

    while (keys.size < len) {
        const idx = Math.floor(nums.length * Math.random());
        keys.add(idx);
    }

    for (let key of keys) {
        result.push(nums[key]);
    }

    return result;
}


let list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

console.log('random sort:', randomSort(list, 5))