// 数组模拟实现一个队列

class Queue{
    constructor(){
        this.items=[];
    }

    /**
     * 进入队列到末尾
     * @param  {...any} items 
     */
    enqueue(...items){
        this.items.push(...items)
    }

    /**
     * 出队列
     * 从队列头部删除
     */
    dequeue(){
        return this.items.shift();
    }

    /**
     * 判断队列是否为空
     */
    isEmpty(){
      return this.items.length === 0;  
    }

    size(){
        return this.items.length;
    }

    toString(){
        return this.items.toString().split(',').join(' ');
    }
}

exports.Queue=Queue;