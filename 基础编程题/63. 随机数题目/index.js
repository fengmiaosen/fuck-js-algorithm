/**
 * 得到一个两数之间的随机整数，包括两个数在内
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * @param min
 * @param max
 */
 function getRandomIntInclusive(min, max) {
    const minValue = Math.ceil(min);
    const maxValue = Math.floor(max);
    return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue; //含最大值，含最小值
  }

  console.log(getRandomIntInclusive(0,2))