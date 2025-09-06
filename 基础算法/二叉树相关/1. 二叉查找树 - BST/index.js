// 二叉查找树是一种特殊的二叉树，相对较小的值保存在左节点中，较大的值保存在右节点中，
// 这一特性使得查找的效率很高，对于数值型和非数值型数据，比如字母和字符串，都是如此。
class BSTNode {
    constructor(data, left, right) {
        this.data = data;
        this.left = left;
        this.right = right;
    }

    show() {
        return this.data;
    }
}

/**
 * 递归调用直到找到叶子节点，然后插入BST节点
 * @param {BSTNode} node 
 * @param {BSTNode} newNode 
 */
function insertNode(node, newNode) {
    if (newNode.data < node.data) {
        if (node.left === null) {
            node.left = newNode;
        } else {
            insertNode(node.left, newNode);
        }
    } else {
        if (node.right === null) {
            node.right = newNode;
        } else {
            insertNode(node.right, newNode);
        }
    }
}

/**
 * 非递归调用循环插入BST节点
 * @param {*} node 
 * @param {*} newNode 
 */
function insertNodeLoop(node, newNode) {
    let current = node;
    let parent;

    while (true) {
        parent = current;

        if (newNode.data < current.data) {
            current = current.left;
            if (!current) {
                parent.left = newNode;
                break;
            }

        } else {
            current = current.right;
            if (!current) {
                parent.right = newNode;
                break;
            }
        }
    }
}

/**
 * 递归调用搜索特定值的节点
 * @param {*} node 
 * @param {*} data 
 */
function searchNode(node, data) {
    if (!node) {
        return null;
    }

    if (node.data === data) {
        return node;
    } else if (data < node.data) {
        return searchNode(node.left, data);
    } else {
        return searchNode(node.right, data);
    }
}

/**
 * 非递归循环搜索特定值节点
 * @param {*} node 
 * @param {*} value 
 */
function findNode(node, value) {
    let current = node;

    while (current) {
        if (current.data === value) {
            return current;
        } else if (current.data > value) {
            current = current.left;
        } else {
            current = current.right;
        }
    }

    return false;
}

/**
 * 递归调用移除对应节点
 * @param {*} node 
 * @param {*} data 
 */
function removeNode(node, data) {
    if (!node) {
        return null;
    }

    if (data < node.data) {
        node.left = removeNode(node.left, data);
    } else if (data > node.data) {
        node.right = removeNode(node.right, data);
    } else { //找到对应节点

        // 叶子节点
        if (!node.left && !node.right) {
            node = null;
            return node;
        }

        //只有一个子节点
        if (node.left === null) {
            node = node.right;
            return node;
        } else if (node.right === null) {
            node = node.left;
            return node;
        }

        // 有两个子节点的节点
        // 根据BST的规则特点，需要找到右侧子节点中最左侧（最小值）的叶子节点
        // 使用其节点值来替换当前节点，并移除找到的叶子节点
        let minNode = findMinNode(node.right);
        node.data = minNode.data;
        node.right = removeNode(node.right, node.data);

        return node;
    }
}

/**
 * 左侧子树中查找最小节点值
 * @param {*} node 
 */
function findMinNode(node) {
    let current = node;

    while (current.left) {
        current = current.left;
    }

    return current.data;
}


// 树的遍历
// 根据访问的顺序,根节点在前面就是前序（根左右），在中间就是中序（左根右），在后面就是后续（左右根）
// 迭代遍历参考 https://juejin.im/post/5e1181445188253a5b3cd5cf#heading-6
// 前序遍历 (根左右)
// 中序遍历 (左根右)
// 后序遍历 (左右根)
class BST {
    constructor() {
        this.root = null;
    }

    /**
     * 插入二叉树节点
     * @param {*} data 
     */
    insert(data) {
        let node = new BSTNode(data, null, null);

        if (!this.root) {
            this.root = node;
        } else {
            insertNode(this.root, node);
            // insertNodeLoop(this.root, node);
        }
    }

    /**
     * 中序遍历
     * @param {*} node 
     */
    inOrder(node) {

        if (node) {
            this.inOrder(node.left);

            console.log('inOrder node:', node.show());

            this.inOrder(node.right);

        }
    }

    /**
     * 迭代实现中序遍历
     * @param {*} root 
     */
    inOrderLoop(root) {
        const res = [];
        const stack = [];
        let node = root;

        while (stack.length > 0 || node) {
            if (node) {
                stack.push(node);
                node = node.left;
            } else {
                node = stack.pop();
                res.push(node.data);

                console.log('inOrder node loop:', node.show());

                node = node.right;
            }
        }

        return res;
    }

    /**
     * 前序遍历
     * @param {BSTNode} node 
     */
    preOrder(root) {

        if (root) {
            console.log('preOrder node:', root.show());

            this.preOrder(root.left);
            this.preOrder(root.right);
        }
    }

    // 迭代实现
    // 前序遍历
    preOrderLoop(root) {
        // 使用数组模拟实现一个栈，刚开始只有根节点
        let stack = [root];

        // 进入循环，当前根节点出栈取值，再按照先右后左的顺序从数组（栈）头部分别压入右节点和左节点
        // 然后开始下次迭代出栈和入栈操作，过程类似递归调用
        while (stack.length) {
            let item = stack.shift();
            console.log('preOrder loop node:', item.show());

            if (item.right) {
                stack.unshift(item.right);
            }

            if (item.left) {
                stack.unshift(item.left);
            }

        }
    }

    /**
     * 后序遍历
     * @param {BSTNode} node 
     */
    postOrder(node) {

        if (node) {

            this.postOrder(node.left);
            this.postOrder(node.right);

            console.log('postOrder node:', node.show())
        }
    }

    /**
     * 后序遍历
     * 迭代调用
     * @param {*} root 
     */
    postOrderLoop(root) {
        const res = [];
        const stack = [];

        while (root || stack.length) {
            res.unshift(root.data)
            root.left && stack.push(root.left)
            root.right && stack.push(root.right)
            root = stack.pop()
        }

        console.log('postOrderLoop:', res);

        return res;
    }

    /**
     * 广度优先（层序）遍历二叉树
     * @param {*} root 
     */
    levelOrder(root) {
        if (!root) { return []; }

        const queue = [root];
        const res = []; // 存放遍历结果

        // 两层循环
        // 外循环负责遍历层级结构的节点
        // 内循环负责遍历每一层节点的左右子节点
        while (queue.length) {
            const subRes = [];
            const level = queue.length; // 当前层的节点数

            for (let i = 0; i < level; i++) {
                //遍历当前节点后，将其移出队列
                const currentNode = queue.shift();
                subRes.push(currentNode.data);

                if (currentNode.left) {
                    queue.push(currentNode.left);
                }

                if (currentNode.right) {
                    queue.push(currentNode.right);
                }
            }

            console.log('queue 2:', queue);

            res.push(subRes);
        }

        console.log('level order:', res);

        return res;
    }

    /**
     * 查找二叉树的最小节点
     */
    getMin() {
        return findMinNode(this.root);
    }

    /**
     * 查找二叉树的最大节点
     */
    getMax() {
        let current = this.root;

        if (current.right) {
            current = current.right;
        }

        return current.data;
    }

    /**
     * 二分法查找
     * @param {*} value 
     */
    find(value) {
        return searchNode(this.root, value);
    }

    /**
     * 移除特定值对应节点
     * @param {*} data 
     */
    remove(data) {
        this.root = removeNode(this.root, data);
    }

    /**
     * 计算二叉树节点总数
     * @param {BSTNode} bst 
     */
    getNodesNum(node) {
        if (!node) {
            return null;
        }

        return this.getNodesNum(node.left) + this.getNodesNum(node.right) + 1;
    }

    /**
     * 计算二叉树最大深度
     * @param {BSTNode} node 
     */
    getMaxDepth(node) {
        if (!node) {
            return null;
        }

        return Math.max(this.getMaxDepth(node.left), this.getMaxDepth(node.right)) + 1;
    }

    /**
     * 计算二叉树最小深度
     * @param {BSTNode} node 
     */
    getMinDepth(node) {
        if (!node) {
            return null;
        }

        const leftDepth = this.getMinDepth(node.left);
        const rightDepth = this.getMinDepth(node.right);

        let depthNum = 0;

        if (leftDepth === 0 || rightDepth === 0) {
            depthNum = leftDepth + rightDepth + 1;
        } else {
            depthNum = Math.min(leftDepth, rightDepth) + 1;
        }

        return depthNum;
    }

    /**
     * 求二叉树第K层的节点个数
     * @param {*} node 
     * @param {*} k
     */
    getKNum(node, k) {

        if (!node || k < 0) {
            return 0;
        }

        if (node && k === 1) {
            return 1;
        }

        return this.getKNum(node.left, k - 1) + this.getKNum(node.right, k - 1);
    }

    /**
     * 求二叉树第K层的叶子节点个数
     * @param {*} node 
     * @param {*} k 
     */
    getKSonNum(node, k) {
        if (!node || k < 0) {
            return null;
        }

        if (node && k === 1) {
            if (node.left === null && node.right === null) {
                return 1;
            } else {
                return 0;
            }
        }

        return this.getKSonNum(node.left, k - 1) + this.getKSonNum(node.right, k - 1);
    }

    /**
     * 二叉树反转
     * @param {*} node 
     */
    reverse(node) {
        if (!node) {
            return null;
        }

        [node.right, node.left] = [this.reverse(node.left), this.reverse(node.right)];

        return node;
    }

}

const bst = new BST();

bst.insert(10);
bst.insert(8);
bst.insert(2);
bst.insert(7);
bst.insert(5);
bst.insert(15);
bst.insert(9);

console.log('bst tree:', JSON.stringify(bst));

bst.preOrder(bst.root);

bst.preOrderLoop(bst.root);

bst.inOrder(bst.root);

bst.inOrderLoop(bst.root);

bst.postOrder(bst.root);

bst.postOrderLoop(bst.root);

bst.levelOrder(bst.root);

// console.log('bst min node:', bst.getMin());

// console.log('bst max node:', bst.getMax());

// console.log('bst find:', bst.find(15));

// console.log('bst nodes num:', bst.getNodesNum(bst.root));

// console.log('bst max depth:', bst.getMaxDepth(bst.root));

// let newBst = bst.reverse(bst.root);

// console.log('bst reverse:', JSON.stringify(newBst));

exports.BST = BST;
exports.BSTNode = BSTNode;