
// 有一堆扑克牌，将牌堆第一张放到桌子上，再将接下来的牌堆的第一张放到牌底，如此往复；

// 最后桌子上的牌顺序为： (牌底) 1,2,3,4,5,6,7,8,9,10,11,12,13 (牌顶)；

// 问：原来那堆牌的顺序，用函数实现。


/**
 * 实现从手牌到桌牌的过程，用于验证
 * @param {array} arr 
 */
function poke(arr) {
    let res = [];
    let i = 1;

    while (arr.length) {

        if (i % 2 > 0) {
            //将手牌中第一张放到桌子上作为底牌
            res.push(arr.shift());
        } else {
            // 再将接下来的手牌堆的第一张放到手牌底
            arr.push(arr.shift());
        }
        i++;
    }

    return res;
}

/**
 * 恢复原先手牌的顺序，可以与上面的函数互为验证
 * @param {array} arr 
 */
function recover(arr) {
    let res = [];
    let i = 1;

    while (arr.length) {

        if (i % 2 > 0) {
            //桌牌的底牌作为手牌的第一张
            res.unshift(arr.pop());
        } else {
            //将手牌的底牌放到手牌的第一张位置（顶牌）
            res.unshift(res.pop());
        }
        i++;
    }

    return res;
}

var arr = [1,2,3,4,5,6,7,8,9,10,11,12,13 ];

console.log('手牌：', recover(arr));


//用于验证我们的恢复算法是否正确
var arr2 = [
    1, 12, 2,  8, 3, 11,
    4,  9, 5, 13, 6, 10,
    7
  ];
  console.log('桌牌:', poke(arr2));