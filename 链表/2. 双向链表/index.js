// 参考资料
// 《学习JavaScript数据结构与算法》

/**
 * 双向链表节点
 */
class DoubleLinkNode {
    constructor(data) {

        this.data = data;
        this.prev = null;
        this.next = null;
    }
}

/**
 * 双向链表
 */
class DoubleLinkList {
    constructor(data) {
        this.head = null;
        this.tail = null;
        this.length = 0;

    }

    /**
     * 链表末尾添加新节点
     * @param {*} data 
     */
    append(data) {
        if(!this.head){
            this.insert(0,data);
        } else{
            this.insert(this.length, data);
        }
    }

    /**
     * 特定位置插入节点
     * @param {*} pos 
     * @param {*} data 
     */
    insert(pos, data) {
        if (pos < 0 || pos > this.length) {
            return false;
        }

        let node = new DoubleLinkNode(data);

        let current = this.head;
        let prevNode = null;

        let index = 0;

        if (pos === 0) {
            if (!this.head) {
                this.head = node;
                this.tail = node;
            } else {
                node.next = current;
                current.prev = node;
                this.head = node;
            }
        } else if (pos === this.length) {
            current = this.tail;

            current.next = node;
            node.prev = current;

            this.tail = node;
        } else {
            while (index < pos) {
                prevNode = current;
                current = current.next;
                index++;
            }
            node.next = current;
            prevNode.next = node;

            current.prev = node;
            node.prev = prevNode;
        }

        this.length++;

        return true;
    }

    removeAt(pos) {
        if (pos < 0 || pos > this.length - 1) {
            return null;
        }
        console.log('remove index:', pos);

        let current = this.head;
        let preNode = null;
        let index = 0;

        if (pos === 0) {
            this.head = current.next;

            if (this.length === 1) {
                this.tail = null;
            } else {
                this.head.prev = null;
            }
        } else if (pos === this.length - 1) {
            current=this.tail;

            this.tail=current.prev;
            this.tail.next=null;
        } else {
            while(index<pos){
                preNode=current;
                current=current.next;
                index++;
            }

            preNode.next=current.next;
            current.next.prev=preNode;
        }

        this.length--;

        return current.data;
    }

    remove(data) {
        const index = this.indexOf(data);

        return this.removeAt(index);
    }

    /**
     * 查找某一节点位置
     * @param {*} data 
     */
    indexOf(data) {
        let current = this.head;
        let index = 0;

        while (current) {

            if (current.data === data) {
                return index;
            }

            index++;
            current = current.next;
        }

        return -1;
    }
}

let linkList = new DoubleLinkList();

linkList.append('111');
linkList.append('222');
linkList.append('333');
linkList.append('aaa');
linkList.append('bbbb');

console.log('linklist:', linkList);

console.log('link indexof aaa:', linkList.indexOf('aaa'));

console.log('link remove data:', linkList.remove('333'));