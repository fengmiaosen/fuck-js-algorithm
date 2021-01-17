function findStr(str1, str2) {
    if (str1.length < str2.length) {
        return []
    }

    let idx = str1.indexOf(str2)
    if (idx < 0) {
        return []
    }

    let idxArr = []
    while (idx > -1) {
        idxArr.push(idx)
        idx = str1.indexOf(str2, idx + str2.length) 
    }

    return idxArr
}

console.log('str find:', findStr('FishPlusOrangePlus', 'Plus'))
