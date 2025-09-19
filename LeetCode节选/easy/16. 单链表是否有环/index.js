
function isCycle(head) {
    if (!head || !head.next) {
        return false
    }

    let map = new WeakMap()

    while (head) {
        if (map.has(head)) {
            return true
        } else {
            head = head.next
            map.set(head, true)
        }
    }

    return false
}