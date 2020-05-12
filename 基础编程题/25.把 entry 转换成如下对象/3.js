var entry = {
  'a.b.c.dd': 'abcdd',
  'a.d.xx': 'adxx',
  'a.e': 'ae',
  'f': 'fff'
}

// 要求转换成如下对象
var output = {
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
  }
}

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

      //记录当前路径对应的对象 
      // a.b.c.dd => 
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

const obj = convert(entry);

console.log('output obj:', JSON.stringify(obj))