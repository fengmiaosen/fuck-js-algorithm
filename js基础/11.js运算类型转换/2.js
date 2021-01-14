// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String#%E5%9F%BA%E6%9C%AC%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%92%8C%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%8C%BA%E5%88%AB
// 区分 JavaScript 字符串对象和基本字符串值
let str1 = String('11');
let str2 = new String('11');

console.log('typeof str1:', typeof str1);
console.log('typeof str2:', typeof str2);

console.log(str1 == str2);
console.log(str1 === str2);