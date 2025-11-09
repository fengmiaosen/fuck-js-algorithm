题目描述
给你 二维 平面上两个 由直线构成且边与坐标轴平行/垂直 的矩形，请你计算并返回两个矩形覆盖的总面积。​
每个矩形由其 左下 顶点和 右上 顶点坐标表示：​
第一个矩形由其左下顶点 (ax1, ay1) 和右上顶点 (ax2, ay2) 定义。​
第二个矩形由其左下顶点 (bx1, by1) 和右上顶点 (bx2, by2) 定义。​

输入：​
 ax1 = -3, ay1 = 0, ax2 = 3, ay2 = 4,​
 bx1 = 0, by1 = -1, bx2 = 9, by2 = 2​
输出：45​

输入：​
ax1 = -2, ay1 = -2, ax2 = 2, ay2 = 2,​
bx1 = -2, by1 = -2, bx2 = 2, by2 = 2​
输出：16

这是一个计算两个矩形覆盖总面积的问题。关键在于要减去重叠部分，避免重复计算。

**解题思路：**
          
**题意理解**
- 给出两个矩形的左下和右上坐标，矩形边与坐标轴平行。
- 目标是计算两个矩形的总覆盖面积，注意要避免把重叠区域算两次。

**核心思路**
- 总面积 = 矩形A面积 + 矩形B面积 − 重叠面积
- 其中，矩形面积用长乘宽，重叠面积需要先判断是否存在，再计算。

**重叠判断**
- 两矩形在 x 方向有交集：`max(ax1, bx1) < min(ax2, bx2)`
- 两矩形在 y 方向有交集：`max(ay1, by1) < min(ay2, by2)`
- 两个方向都满足，才有重叠；否则重叠面积为 0。
- 这也解释了你文档中的“重叠边界计算”：使用 `max` 和 `min` 找到交集的左右边界和上下边界。

**计算步骤**
- 计算各自面积：
  - `areaA = (ax2 - ax1) * (ay2 - ay1)`
  - `areaB = (bx2 - bx1) * (by2 - by1)`
- 计算重叠边界：
  - `overlapLeft = max(ax1, bx1)`
  - `overlapRight = min(ax2, bx2)`
  - `overlapBottom = max(ay1, by1)`
  - `overlapTop = min(ay2, by2)`
- 判断是否有重叠并计算重叠面积：
  - 如果 `overlapLeft < overlapRight && overlapBottom < overlapTop`
  - 则 `overlapArea = (overlapRight - overlapLeft) * (overlapTop - overlapBottom)`
  - 否则 `overlapArea = 0`
- 最终答案：
  - `total = areaA + areaB - overlapArea`

**示例推演**
- 示例1：`A=(-3,0)-(3,4), B=(0,-1)-(9,2)`
  - `areaA = (3 - (-3)) * (4 - 0) = 6 * 4 = 24`
  - `areaB = (9 - 0) * (2 - (-1)) = 9 * 3 = 27`
  - 重叠边界：
    - `overlapLeft = max(-3, 0) = 0`
    - `overlapRight = min(3, 9) = 3`
    - `overlapBottom = max(0, -1) = 0`
    - `overlapTop = min(4, 2) = 2`
  - 有重叠，`overlapArea = (3-0) * (2-0) = 3 * 2 = 6`
  - 总面积：`24 + 27 - 6 = 45`（与示例一致）
- 示例2：两个相同矩形 `(-2,-2)-(2,2)`
  - `areaA = areaB = 16`
  - 重叠面积 = 16（完全重叠）
  - 总面积：`16 + 16 - 16 = 16`

**边界情况**
- 仅边或角接触（如 `overlapLeft == overlapRight` 或 `overlapBottom == overlapTop`）：
  - 没有面积重叠，`overlapArea = 0`。
- 一个矩形完全包含另一个：
  - 重叠面积就是被包含的矩形面积。
- 坐标为负数或矩形大小为零：
  - 公式同样适用；若某矩形宽或高为 0，则其面积为 0。

**复杂度与正确性**
- 时间复杂度 `O(1)`：只有常量次的加减乘与比较。
- 正确性来源于几何上的区间交集思想：横向用 `[ax1, ax2]` 与 `[bx1, bx2]` 的交集，纵向同理。

**易错点提醒**
- 忘记重叠条件使用严格小于：必须用 `<`，不能用 `<=`，否则“仅边接触”会被误算为有面积。
- 忽略坐标顺序：题目保证左下、右上，但如果在其他场景中不保证，需先规范化保证 `x1 < x2, y1 < y2`。
- 重叠面积没有先判断是否存在就直接相减，会得到负数。

**对应代码结构（与你项目一致）**
- 面积计算：`areaA/areaB` 两行
- 重叠边界：`overlapLeft/Right/Bottom/Top` 四行（你文档第 50 行“重叠边界计算”正对应这里）
- 重叠条件与面积：`if (overlapLeft < overlapRight && overlapBottom < overlapTop) {...}`
- 返回总面积：`areaA + areaB - overlapArea`

掌握“区间交集”的思维后，这类矩形/线段重叠问题都能用相同套路快速求解。
        