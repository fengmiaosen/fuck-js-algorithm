var entry = {
  a: {
    b: {
      c: {
        dd: 'abcdd'
      }
    },
    d: {
      xx: 'adxx'
    },
    e: 'ae'
  },
  fg: 'a12'
}

//   // 要求转换成如下对象
//   var output = {
//     'a.b.c.dd': 'abcdd',
//     'a.d.xx': 'adxx',
//     'a.e': 'ae'
//   }
function flatObj(obj, parentKey = '', result = {}) {

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const currentKey = `${parentKey}${key}`;

      if (typeof obj[key] === 'object') {
        flatObj(obj[key], currentKey + '.', result);
      } else {
        result[currentKey] = obj[key];
      }
    }
  }

  return result;
}

const result = flatObj(entry);

console.dir(result, { depth: null });
