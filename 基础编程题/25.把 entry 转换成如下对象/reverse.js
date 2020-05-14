var entry = {
  'a.b.c.dd': 'abcdd',
  'a.d.xx': 'adxx',
  'a.e': 'ae',
  'f': 'fff'
}

// // 要求转换成如下对象
// var output = {
//   a: {
//     b: {
//       c: {
//         dd: 'abcdd'
//       }
//     },
//     d: {
//       xx: 'adxx'
//     },
//     e: 'ae'
//   }
// }

/**
 * 
 * @param {object} obj 
 * @param {string} pathKey 
 */
function convert(obj) {
  let map = {};

  for (let key in obj) {

    if (key.includes('.')) {
      const keys = key.split('.');

      let curObj = map;

      for (let i = 0; i < keys.length; i++) {
        const item = keys[i];

        if (!curObj[item]) {
          if (i === keys.length - 1) {
            curObj[item] = obj[key];
          } else {
            curObj[item] = {};
          }
        }

        curObj = curObj[item];
      }
    } else {
      map[key] = obj[key];
    }
  }

  return map;
}

/**
 * 使用Array.reduce优化后
 * @param {*} obj 
 */
function convert2(obj) {

  let result = {};

  for (let key in obj) {
    if (key.includes('.')) {
      const keys = key.split('.');

      // reduce的初始化参数要指向 result对象
      keys.reduce((acc, cur, idx) => {
        if (!acc[cur]) {
          if (idx === keys.length - 1) {
            acc[cur] = obj[key];
          } else {
            acc[cur] = {};
          }
        }

        return acc[cur];
      }, result);

    } else {
      result[key] = obj[key];
    }
  }

  return result;
}


const obj = convert(entry);
console.log('output obj11:', JSON.stringify(obj))

const obj2 = convert2(entry);
console.log('output obj22:', JSON.stringify(obj2))