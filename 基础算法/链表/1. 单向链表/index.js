// 参考
// https://juejin.im/post/5b247a02f265da599c5604df
// https://juejin.im/post/5e787b42e51d45272054dfae?utm_source=gold_browser_extension#heading-25

/**
 * 单向链表节点
 */
class LinkNode {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

/**
 * 单向链表
 */
class LinkNodeList {
    constructor(data) {
        this.head = null;
        this.length = 0;
    }

    append(data) {
        let node = new LinkNode(data);

        if (!this.head) {
            this.head = node;
        } else {
            let current = this.head;

            while (current.next) {
                current = current.next;
            }

            current.next = node;
        }
        this.length++;
    }

    delete(data) {
        if (this.head.data === data) {
            this.head = this.head.next;
            return;
        }

        let preNode = this.preFind(data);

        preNode.next = preNode.next && preNode.next.next;
    }

    find(data) {
        let current = this.head;

        while (current) {
            if (current.data === data) {
                break;
            }
            current = current.next;
        }

        return current;

    }

    preFind(data) {
        let current = this.head;

        while (current.next) {
            if (current.next.data === data) {
                break
            }
            current = current.next
        }
        return current;
    }

    /**
     * 替换链表特定节点的值
     * @param {*} data 
     * @param {*} newData 
     */
    fixed(data, newData) {
        let current = this.find(data);

        current.data = newData;
    }

    /**
     * 链表特定位置插入节点
     * @param {*} pos 
     * @param {*} data 
     */
    insert(pos, data) {
        if (pos < 0 && pos > this.length) {
            return false;
        }

        let newNode = new LinkNode(data);
        let current = this.head;
        let preNode = null;
        let index = 0;

        if (pos === 0) {
            newNode.next = current;
            this.head = newNode;
        } else {
            while (index < pos) {
                preNode = current;
                current = current.next;
                index++;
            }

            preNode.next = newNode;
            newNode.next = current;
        }

        this.length++;

        return true;
    }

    /**
     * 链表删除特定位置的节点
     * @param {*} pos 
     */
    removeAt(pos) {
        if (pos < 0 || pos > this.length - 1) {
            return null;
        }

        let current = this.head;

        if (pos === 0) {
            this.head = current.next;
        } else {
            let index = 0;
            let preNode = null;

            while (index < pos) {
                preNode = current;
                current = current.next;
                index++;
            }

            preNode.next = current.next;
        }

        this.length--;

        return current;
    }

    /**
     * 查找特定值的位置
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

    toString() {

        let current = this.head;
        let value = current.data;

        while (current.next) {
            value = `${value},${current.next.data}`;
            current = current.next;
        }

        return value;
    }

    get size() {

        return this.length;
    }
}

// let linkList = new LinkNodeList();

// linkList.append('111');
// linkList.append('222');
// linkList.append('333');
// linkList.append('aaa');
// linkList.append('bbbb');

// console.log('link list 1:', JSON.stringify(linkList));


// console.log('link find 333:', linkList.find('333'));

// console.log('link find xxxxx:', linkList.find('xxxxxx'));

// console.log('link pre find bbb:', linkList.find('bbbb'));

// console.log('link delete:', linkList.delete('333'));

// console.log('link fixed:', linkList.fixed('aaa', 'fffffff'));

// console.log('link remove at:', linkList.removeAt(2));

// console.log('link insert at:', linkList.insert(2, 'yyy'));

// console.log('link indexof:', linkList.indexOf('bbb'));

// console.log('link to string:', linkList.toString());

// console.log('link list 2:', JSON.stringify(linkList));

exports.LinkNode = LinkNode;
exports.LinkNodeList = LinkNodeList;