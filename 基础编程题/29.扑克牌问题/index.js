// 有一堆扑克牌，将牌堆第一张放到桌子上，再将接下来的牌堆的第一张放到牌底，如此往复；

// 最后桌子上的牌顺序为： (牌底) 1,2,3,4,5,6,7,8,9,10,11,12,13 (牌顶)；

// 问：原来那堆牌的顺序，用函数实现


/**
 * 正向：即从手牌到桌牌（用于检验结果）
 * @param {*} 手牌序列arr 
 */
function generate(arr) {
    const res = [];

    while(arr.length){
        // 手牌的底牌放到桌上作为底牌
        res.push(arr.pop());

        // 继续把手牌的底牌移动到顶部
        if(arr.length){
            arr.unshift(arr.pop());
        }
    }

    return res;
}

/**
 * 逆向：即从桌牌到手牌
 * @param {*} 桌牌序列 arr 
 */
function recover(arr){
    let res = [];

    while(arr.length){
        // 如果手牌已经存在，则把顶部一张移动到底部
        if(res.length){
            res.push(res.shift());
        }
        // 桌牌的底牌放到手牌底部
        res.push(arr.pop());
    }

    return res;
}


const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
console.log('recover arr:', recover(arr1));

const arr2 = [7, 10, 6, 13, 5, 9, 4, 11, 3, 8, 2, 12, 1];
console.log('generate arr:', generate(arr2));
