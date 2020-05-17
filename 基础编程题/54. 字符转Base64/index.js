// 参考 https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/299

//字符串转base64
// 编码过程

const encodeData=window.btoa('this is a example!');
console.log('encodeData:', encodeData);


//base64转字符串
const decodeData=window.atob(encodeData);
console.log('decodeData:', decodeData);
