

function randomSort(nums, len) {
    const MAX_COUNT = nums.length;
    const result = new Set();

    while (result.size < len) {
        const idx = Math.floor(MAX_COUNT * Math.random());
        result.add(nums[idx]);
    }

    return Array.from(result);
}


let list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 130, 4567, 98, 76, 467, 387];

console.log('random sort:', randomSort(list, 5))