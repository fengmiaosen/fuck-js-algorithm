class LRUCache {
    constructor(max){
        this.max=max;

        //用于控制key顺序已经计算列表长度
        this.keys=[];

        // 用户存储键值对
        this.cache={};
    }

    add(key, value){
        if(this.keys.length > this.max-1){
            this.keys.shift();
            delete this.cache[this.keys[0]];
        }

        this.keys.push(key);
        this.cache[key]=value;
    }

    get(key){
        const value=this.cache[key];

        if(!value){
            return;
        }

        //删除当前位置的key
        const idx = this.keys.indexOf(key);
        this.keys.splice(idx, 1);

        // 数组尾部追加
        this.keys.push(key);

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

console.log('keys:',lru.keys,'cache:', lru.cache);