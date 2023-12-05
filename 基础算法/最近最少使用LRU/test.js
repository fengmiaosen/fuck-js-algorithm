
class LRUCache {
    constructor(max) {
        this.max = max || 10
        this.cache = new Map()
    }

    add(key, value) {
        if (this.cache.size > this.max - 1) {
            let key = this.cache.keys().next().value
            this.cache.delete(key)
        }
        this.cache.set(key, value)
    }

    get(key) {
        let value = this.cache.get(key)
        if (!value) {
            return -1
        }

        this.cache.delete(key)
        this.cache.set(key, value)

        return value
    }
}

const cache = new LRUCache(2 /* 缓存容量 */);

cache.add(1, 1);
cache.add(2, 2);
console.log(cache.get(1));       // 返回  1
cache.add(3, 3);    // 该操作会使得密钥 2 作废
console.log(cache.get(2));       // 返回 -1 (未找到)
cache.add(4, 4);    // 该操作会使得密钥 1 作废
console.log(cache.get(1));       // 返回 -1 (未找到)
console.log(cache.get(3));       // 返回  3
console.log(cache.get(4));       // 返回  4

console.log(cache.cache);

