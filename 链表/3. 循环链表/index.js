// 方法一：
// JSON.stringify() 不能序列化含有循环引用的结构

function hasCycle(head){

    try {
        JSON.stringify(head);
        return false;
    } catch(err) {
        return true;
    }
}

// 方法二
// 快慢指针（双指针法）
// 设置快慢两个指针，遍历单链表，快指针一次走两步，慢指针一次走一步，如果单链表中存在环，则快慢指针终会指向同一个节点，否则直到快指针指向 null 时，快慢指针都不可能相遇

function hasCycle2(head) {
    if(!head || !head.next){
        return false
    }

    let fast = head.next.next;
    let slow = head.next;

    while(fast !== slow){

        if(!fast || !fast.next){
            return false;
        }

        fast = fast.next.next;
        slow = slow.next;
    }

    return true;
}