const { LinkNodeList } = require('../链表/1. 单向链表')


// 哈希表（散列表） HashTable 也叫 HashMap
// 起作用是尽可能快的在数据结构中找到一个值
// 散列函数 作用是给定一个键值，然后返回在表中的地址

class HashTable {
    constructor() {
        this.table = [];
    }

    /**
     * 散列函数
     * 根据key的每个字符的ASCII码值的和得到一个数字
     * @param {*} key 
     */
    hashCode(key) {
        let hash = 0;

        for (let i = 0; i < key.length; i++) {
            hash += key.charCodeAt(i);
        }

        return hash % 37;
    }

    put(key, value) {
        let pos = this.hashCode(key);

        console.log('pos:', pos);

        if (this.table[pos] === undefined) {
            this.table[pos] = new LinkNodeList();
        }

        this.table[pos].append({
            key,
            value
        });
    }

    get(key) {
        let pos = this.hashCode(key);

        if (this.table[pos] !== undefined) {
            let linkList = this.table[pos];
            let current = linkList.head;

            while (current.next) {
                if (current.data.key === key) {
                    return current.data.value;
                }

                current = current.next;
            }

            // 判断最后一个节点
            if (current.data.key === key) {
                return current.data.value;
            }

        }

        return undefined;
    }

    remove(key) {
        let pos = this.hashCode(key);

        if (this.table[pos] !== undefined) {
            let linkList = this.table[pos];
            let current = linkList.head;

            while (current.next) {
                if (current.data.key === key) {
                    this.table[pos].remove(current.data);
                    return true;
                }
                current = current.next;
            }

            //最后一个节点
            if (current.data.key === key) {
                this.table[pos].remove(current.data);
                return true;
            }

        }
    }
}

let hash = new HashTable();

hash.put('gandalf', 'ggg')
hash.put('john', 'jjj')
hash.put('aaron', 'aaaaaaa')
hash.put('tyrion', 'tttt')

console.log('hash table:', hash);
