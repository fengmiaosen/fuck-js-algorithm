// leetcode 223. 矩形面积
// https://leetcode.cn/problems/rectangle-area/solutions/1024639/ju-xing-mian-ji-by-leetcode-solution-xzbl/
function computeArea(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
    // 计算两个矩形的面积
    const areaA = (ax2 - ax1) * (ay2 - ay1);
    const areaB = (bx2 - bx1) * (by2 - by1);
    
    // 计算重叠区域的边界
    const overlapLeft = Math.max(ax1, bx1);
    const overlapRight = Math.min(ax2, bx2);
    const overlapBottom = Math.max(ay1, by1);
    const overlapTop = Math.min(ay2, by2);
    
    // 计算重叠面积
    let overlapArea = 0;
    if (overlapLeft < overlapRight && overlapBottom < overlapTop) {
        overlapArea = (overlapRight - overlapLeft) * (overlapTop - overlapBottom);
    }
    
    return areaA + areaB - overlapArea;
}

// 示例1
console.log(computeArea(-3, 0, 3, 4, 0, -1, 9, 2)); // 45
// 矩形A面积: 6 * 4 = 24
// 矩形B面积: 9 * 3 = 27  
// 重叠面积: 3 * 2 = 6
// 总面积: 24 + 27 - 6 = 45

// 示例2  
console.log(computeArea(-2, -2, 2, 2, -2, -2, 2, 2)); // 16
// 两个完全相同的矩形，面积都是16，完全重叠
// 总面积: 16 + 16 - 16 = 16