// https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/?utm_source=LCUS&utm_medium=ip_redirect&utm_campaign=transfer2china


/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */


function TreeNode(val, left, right) {
    this.val = (val === undefined ? 0 : val)
    this.left = (left === undefined ? null : left)
    this.right = (right === undefined ? null : right)
}

/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function (preorder, inorder) {

    if (!preorder.length || !inorder.length) {
        return null
    }

    let rootVal = preorder.shift()
    let node = new TreeNode(rootVal)

    let idx = inorder.indexOf(rootVal)

    node.left = buildTree(preorder, inorder.slice(0, idx))
    node.right = buildTree(preorder, inorder.slice(idx + 1))

    return node
};

console.log(buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]))
