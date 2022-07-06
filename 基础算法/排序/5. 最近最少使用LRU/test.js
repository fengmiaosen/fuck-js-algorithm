
class LRUCache {
    constructor(max) {
        this.max = max

        this.map = new Map()
    }

    /**
     * 
     * @param {*} key 
     * @param {*} value 
     */
    add(key, value) {
        if (this.map.size >= this.max) {
            let firstKey = this.map.keys().next().value
            this.map.delete(firstKey);
        }
        this.map.set(key, value)
    }

    /**
     * 
     * @param {*} key 
     */
    get(key) {
        let curValue = this.map.get(key)
        if (!curValue) {
            return
        }
        this.map.delete(key)
        this.map.set(key, curValue);

        return curValue
    }
}

const lru = new LRUCache(4);

lru.add(1, 1);
lru.add(2, 2);
lru.add(3, 3);
lru.add(4, 4);

lru.get(3);
lru.get(3);
lru.get(2);
lru.add(5, 5);

console.log(lru.map);