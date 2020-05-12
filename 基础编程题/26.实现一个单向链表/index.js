 /**
    单向链表

    链表：由多个节点构成，每个节点包含自身数据和指向下个节点的引用
         物理上可以不连续但逻辑上必须连续（不一定是一块连续的内存）

    链表是一种常见的基础数据结构，是一种线性表，但是不会按线性的顺序存储数据而是每个节点存指向下个节点的引用
 */
class LinkNode {
    constructor(val) {
        if (val === void 0) throw new Error('请输入链表节点值')
        this.node = val
        this.next = null
    }
}

class LinkList {
    head = null
    size = 0

    // 有没有初始化的方法呢 ？？？
    initLinkedList() {}

    /**
    * @description: 根据索引获取 node，从头部遍历
    * @param {index} 
    * @return: linkNode
    */
    findNode(index) {
        if (index < 0 || index >= this.size || this.size == 0) return null
        let node = this.head
        for (let i=0; i<index; i++) {
            if (!node) return null
            node = node.next
        }
        return node ? node : null
    }
    
    // 时间复杂度 O(n)
    get(index) {
        return this.findNode(index)
    }

    // 时间复杂度 O(n)
    push(val) {
        const node = new LinkNode(val)
        if (!this.head) {
            this.head = node
        } else {
            let tail = this.findNode(this.size - 1)
            tail.next = node
        }
        this.size++
        return this
    }
    // 时间复杂度 O(1)
    unshift(val) {
        const node = new LinkNode(val)
        if (!this.head) {
            this.head = node
        } else {
            let temp = this.head
            this.head = node
            this.head.next = temp
        }
        this.size++
        return this
    }
    // 时间复杂度 O(1)
    shift() {
        if (!this.head) return -1
        this.head = this.head.next
        this.size--
        return this
    }
    // 时间复杂度 O(2n)
    pop() {
        return this.removeAtIndex(this.size-1)
    }
    // 时间复杂度 O(2n)
    removeAtIndex(index) {
        if (!this.head || index >= this.size || index < 0 || this.size == 0) return

        const prevNode = this.findNode(index-1)
        const nextNode = this.findNode(index+1)
        const currNode = this.findNode(index)
        // 正常情况
        if (prevNode && nextNode) {
            prevNode.next = nextNode
        }
        // 索引为 0, size 大于 1 === shift
        if (!prevNode && nextNode) {
            this.head = this.head.next
        }

        // 索引为 size-1 === pop
        if (prevNode && !nextNode) {
            prevNode.next = null
        }

        // 索引为 0，size为 1 
        if (!prevNode && !nextNode) {
            this.head = null
        }
        this.size--
        return currNode
    }

    // 时间复杂度 O(2n)
    addAtIndex(val, index=this.size) {
        const node = new LinkNode(val)
        if (!node && (index > this.size || index < 0)) return

        // 尾不追加
        if (this.size === 0 || index === this.size) return this.push(node)

        // 头部追加
        if (index === 0) return this.unshift(node)

        // 中间部位
        const prevNode = this.findNode(index-1)
        const nextNode = this.findNode(index+1)

        prevNode.next = node
        node.next = nextNode
        this.size++
        return this
    }

    // 清空单链表
    clear() {
        this.head = null
        this.size = 0
        return this
    }

    // 翻转链表
    reverse() {
        if (this.head === null || this.head.next === null) return this.head
        // ... 待更新
        return this
    }
}

var list = new LinkList()


list.push('a').push('b').push('c')
