// https://leetcode.cn/problems/path-sum/

// 给你二叉树的根节点 root 和一个表示目标和的整数 targetSum 。判断该树中是否存在 根节点到叶子节点 的路径，这条路径上所有节点值相加等于目标和 targetSum 。如果存在，返回 true ；否则，返回 false 。

// 叶子节点 是指没有子节点的节点。

// 来源：力扣（LeetCode）
// 链接：https://leetcode.cn/problems/path-sum
// 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * 方法一：DFS、前序遍历
 * 将 sum 值减去当前节点的 val 值作为新的节点值
 * 然后递归去查找，假如找到等于目标值的节点，且该节点为叶子节点，返回 true
 * @param {TreeNode} root
 * @param {number} sum
 * @return {boolean}
 */
 var hasPathSum = function (root, sum) {

    if (!root) {
        return false;
    }

    //叶子节点
    if (!root.left && !root.right && root.val == sum) {
        return true;
    }

    // 左右子树是否满足路径和
    return (
        hasPathSum(root.left, sum - root.val) ||
        hasPathSum(root.right, sum - root.val)
    );
};