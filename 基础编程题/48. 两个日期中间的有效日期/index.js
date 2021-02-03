
function rangeDate(startDate, endDate) {

    const startTime = new Date(startDate).getTime()
    const endTime = new Date(endDate).getTime()
    // 单位 ms
    const dayTime = 24 * 60 * 60 * 1000

    const res = []

    for (let time = startTime; time <= endTime; time += dayTime) {
        const date = new Date(time)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()

        res.push(`${year}-${month}-${day}`)
    }

    return res
}

console.dir(rangeDate("2015-2-8", "2016-3-3"), { depth: null });
