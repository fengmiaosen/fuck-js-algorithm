
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/entries#%E5%B0%86object%E8%BD%AC%E6%8D%A2%E4%B8%BAmap

var obj = { foo: "bar", baz: 42 };
var objEnt = Object.entries(obj)
console.log('objEnt:', objEnt);

var map = new Map(objEnt);
console.log('map:', map);