
class LRU {
    constructor(maxLength = 50) {
        this.max = maxLength

        this.cache = new Map()
    }

    add(key, value){
        if(this.cache.size >= this.max){
            const fk = this.cache.keys().next().value
            this.cache.delete(fk)
        }
        this.cache.set(key, value)
    }

    get(key){
        if(!this.cache.get(key)){

        }

    }
}

const lru = new LRUCache(3);

lru.add(1, 1);
lru.add(2, 2);
lru.add(3, 3);
lru.add(4, 4);
lru.get(2);
lru.get(2);
lru.get(2);
lru.add(5, 5);

console.log(lru.cache);