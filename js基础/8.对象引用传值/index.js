// 这里把o改成a
// webSite引用地址的值copy给a了
function changeObjProperty(a) {
    // 改变对应地址内的对象属性值
    a.siteUrl = "http://www.baidu.com"
    // 变量a指向新的地址 以后的变动和旧地址无关
    a = new Object()
    a.siteUrl = "http://www.google.com"
    a.name = 456
  } 
  var webSite = new Object();
  webSite.name = '123'
  changeObjProperty(webSite);
  console.log(webSite); // {name: 123, siteUrl: 'http://www.baidu.com'}