
function find(str, target) {
    if (str.length < target.length) {
        return -1
    }

    let idxArr = []
    let idx = str.indexOf(target)

    while (idx !== -1) {
        idxArr.push(idx)
        idx = str.indexOf(target, idx + target.length)
    }

    return idxArr
}

console.log('str find:', find('FishPlusOrangePlus', 'Plus'))