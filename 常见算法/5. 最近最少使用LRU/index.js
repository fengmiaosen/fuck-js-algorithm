// 获取数据 get(key) - 如果密钥 ( key ) 存在于缓存中，则获取密钥的值（总是正数），否则返回 -1 。
// 写入数据 add(key, value) - 如果密钥不存在，则写入数据。当缓存容量达到上限时，它应该在写入新数据之前删除最久未使用的数据，从而为新数据留出空间。

class LRUCache {

    constructor(max) {
        this.max = max || 1000;

        // Map 对象保存键值对，并且能够记住键的原始插入顺序。任何值(对象或者原始值) 都可以作为一个键或一个值。
        this.cache = new Map();
    }

    add(key, value) {
        // 当缓存容量达到上限时，它应该在写入新数据之前删除最久未使用的数据(即最早插入的)，从而为新数据留出空间
        if (this.cache.size > this.max - 1) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        this.cache.set(key, value);
    }

    get(key) {

        const value = this.cache.get(key);
        if (!value) {
            return;
        }

        //先从map中删除当前访问的key，再重新添加到最新的顺序位置
        this.cache.delete(key);
        this.cache.set(key, value);

        return value;
    }
}

const lru = new LRUCache(4);

lru.add(1, 1);
lru.add(2, 2);
lru.add(3, 3);
lru.add(4, 4);
lru.get(2);
lru.get(2);
lru.get(2);
lru.add(5, 5);

console.log(lru.cache);