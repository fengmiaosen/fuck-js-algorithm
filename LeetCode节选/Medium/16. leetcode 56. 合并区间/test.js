function merge(intervals) {
    if (intervals.length <= 1) {
        return []
    }

    intervals.sort((a, b) => a[0] - b[0])

    let res = [intervals[0]]

    for (let i = 1; i < intervals.length; i++) {
        let curInter = intervals[i]
        let lastMergedInterval = res[res.length - 1]

        if (curInter[0] <= lastMergedInterval[1]) {
            lastMergedInterval[1] = Math.max(lastMergedInterval[1], curInter[1])
        } else {
            res.push(curInter)
        }

    }

    return res
}


console.log(merge([[1, 3], [2, 6], [8, 10], [15, 18]]))
