const { LinkNode, LinkNodeList } = require('./index')

// * 参考实现 https://github.com/sisterAn/JavaScript-Algorithms/issues/11

/**
 * 合并两个有序单链表
 * 实现方法类似归并排序中的合并两个有序数组
 * @param {LinkNode} link1 
 * @param {LinkNode} link2 
 */
function mergeLinkList(link1, link2) {

    let resultLink = new LinkNodeList();

    while (link1 && link2) {
        if (link1.data < link2.data) {
            resultLink.append(link1.data);
            link1 = link1.next;
        } else {
            resultLink.append(link2.data);
            link2 = link2.next;
        }
    }

    let linkNode = link1 || link2;
    while (linkNode) {
        resultLink.append(linkNode.data);
        linkNode = linkNode.next;
    }

    return resultLink;
}

/**
 * 递归调用
 * 合并两个有序单链表
 * @param {LinkNode} link1 
 * @param {LinkNode} link2 
 */
function mergeTwoList(link1, link2) {
    
    if(!link1){
        return link2;
    }

    if(!link2){
        return link1;
    }

    if(link1.data < link2.data){
        link1.next=mergeTwoList(link1.next, link2);
        return link1;
    } else {
        link2.next=mergeTwoList(link1, link2.next);
        return link2;
    }
}

let linkList = new LinkNodeList();

linkList.append(111);
linkList.append(333);
linkList.append(555);
linkList.append(777);
linkList.append(11111);

console.log('link list 1:', JSON.stringify(linkList));

let linkList2 = new LinkNodeList();

linkList2.append(222);
linkList2.append(444);
linkList2.append(666);
linkList2.append(888);
linkList2.append(1000);
linkList2.append(2000);

console.log('link list 2:', JSON.stringify(linkList2));

// let newList = mergeLinkList(linkList.head, linkList2.head);
// console.log('merge link list111:', JSON.stringify(newList));

let newList2 = mergeTwoList(linkList.head, linkList2.head);
console.log('merge link list222:', JSON.stringify(newList2));
