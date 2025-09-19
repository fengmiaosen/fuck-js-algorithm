// 示例:

// 输入: 1->2->3->4->5->NULL
// 输出: 5->4->3->2->1->NULL
// 进阶:
// 你可以迭代或递归地反转链表。你能否用两种方法解决这道题？
// https://github.com/sisterAn/JavaScript-Algorithms/issues/14

// 方法一：迭代法
var reverseList = function (head) {
    if (!head || !head.next) return head
    var prev = null, cur = head
    while (cur) {
        // 用于临时存储 curr 后继节点
        var next = cur.next
        // 反转 curr 的后继指针
        cur.next = prev
        // 变更prev、curr 
        // 待反转节点指向下一个节点 
        prev = cur
        cur = next
    }
    head = prev
    return head
};