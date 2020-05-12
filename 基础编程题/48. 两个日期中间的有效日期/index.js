// 如 2015-2-8 到 2015-3-3，返回【2015-2-8 2015-2-9...】


// 思路一：
// 先拿到两个时间的时间差，从开始时间每次加一天塞入
// https://www.javascriptc.com/interview-tips/zh_cn/javascript/between-two-dates/

//2015-2-8 2015-3-3
/**
 * 
 * @param {*} startDate 
 * @param {*} endDate 
 */
function rangeDate(startDate, endDate) {

    //每一天的时间毫秒数
    const dayTime = 24 * 60 * 60 * 1000;

    //起始日期的毫秒数
    const startTime = new Date(startDate).getTime();

    // 截止日期的毫秒数
    const endTime = new Date(endDate).getTime();

    const res = [];

    //计算起止日期之间的所有日期，并转换为年月日格式
    for (let i = startTime; i <= endTime; i += dayTime) {

        const current = new Date(i);
        const year = current.getFullYear();
        const month = current.getMonth()+1;
        const day= current.getDate();

        res.push(`${year}-${month}-${day}`)
    }

    return res;
}

console.log(rangeDate("2015-2-8", "2015-3-3"));
