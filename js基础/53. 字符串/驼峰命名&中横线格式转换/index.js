
/**
 * 中横线转换为驼峰式命名
 * @param {string} str 中横线格式的字符串
 * @returns {string} 驼峰式命名的字符串
 */
function kebabToCamel(str) {
    if (!str || typeof str !== 'string') {
        return str;
    }
    
    return str.replace(/-([a-z])/g, (match, letter) => {
        return letter.toUpperCase();
    });
}

/**
 * 驼峰式转换为中横线格式
 * @param {string} str 驼峰式命名的字符串
 * @returns {string} 中横线格式的字符串
 */
function camelToKebab(str) {
    if (!str || typeof str !== 'string') {
        return str;
    }
    
    return str
        // 处理首字母大写的情况（PascalCase）
        .replace(/^[A-Z]/, match => match.toLowerCase())
        // 将大写字母转换为 -小写字母
        .replace(/[A-Z]/g, match => '-' + match.toLowerCase());
}

/**
 * 中横线转换为帕斯卡命名（首字母大写的驼峰）
 * @param {string} str 中横线格式的字符串
 * @returns {string} 帕斯卡命名的字符串
 */
function kebabToPascal(str) {
    if (!str || typeof str !== 'string') {
        return str;
    }
    
    const camelCase = kebabToCamel(str);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}

/**
 * 帕斯卡命名转换为中横线格式
 * @param {string} str 帕斯卡命名的字符串
 * @returns {string} 中横线格式的字符串
 */
function pascalToKebab(str) {
    return camelToKebab(str);
}

// ============ 测试用例 ============
console.log('=== 中横线转驼峰测试 ===');
console.log('get-element-by-id ->', kebabToCamel('get-element-by-id')); // getElementById
console.log('background-color ->', kebabToCamel('background-color')); // backgroundColor
console.log('font-size ->', kebabToCamel('font-size')); // fontSize
console.log('margin-top ->', kebabToCamel('margin-top')); // marginTop

console.log('\n=== 驼峰转中横线测试 ===');
console.log('getElementById ->', camelToKebab('getElementById')); // get-element-by-id
console.log('backgroundColor ->', camelToKebab('backgroundColor')); // background-color
console.log('fontSize ->', camelToKebab('fontSize')); // font-size
console.log('marginTop ->', camelToKebab('marginTop')); // margin-top

console.log('\n=== 帕斯卡命名测试 ===');
console.log('BorderTop ->', camelToKebab('BorderTop')); // border-top
console.log('GetElementById ->', camelToKebab('GetElementById')); // get-element-by-id
console.log('XMLHttpRequest ->', camelToKebab('XMLHttpRequest')); // x-m-l-http-request

console.log('\n=== 中横线转帕斯卡测试 ===');
console.log('get-element-by-id ->', kebabToPascal('get-element-by-id')); // GetElementById
console.log('background-color ->', kebabToPascal('background-color')); // BackgroundColor

console.log('\n=== 边界情况测试 ===');
console.log('空字符串 ->', kebabToCamel('')); // ''
console.log('null ->', kebabToCamel(null)); // null
console.log('undefined ->', kebabToCamel(undefined)); // undefined
console.log('单个单词 ->', kebabToCamel('hello')); // hello
console.log('单个单词 ->', camelToKebab('hello')); // hello
console.log('已经是驼峰 ->', kebabToCamel('alreadyCamel')); // alreadyCamel
console.log('已经是中横线 ->', camelToKebab('already-kebab')); // already-kebab

// ============ 实际应用示例 ============
console.log('\n=== 实际应用示例 ===');

// CSS 属性名转换
const cssProperties = {
    'background-color': '#fff',
    'font-size': '14px',
    'margin-top': '10px',
    'border-radius': '5px'
};

const jsStyleObject = {};
for (const [key, value] of Object.entries(cssProperties)) {
    jsStyleObject[kebabToCamel(key)] = value;
}
console.log('CSS属性转JS样式对象:', jsStyleObject);

// JS 样式对象转 CSS
const jsStyle = {
    backgroundColor: '#000',
    fontSize: '16px',
    marginTop: '20px',
    borderRadius: '10px'
};

const cssString = Object.entries(jsStyle)
    .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
    .join('; ');
console.log('JS样式对象转CSS字符串:', cssString);

// ============ 性能测试 ============
console.log('\n=== 性能测试 ===');
const testStr = 'get-element-by-id-from-document';
const iterations = 100000;

console.time('kebabToCamel性能测试');
for (let i = 0; i < iterations; i++) {
    kebabToCamel(testStr);
}
console.timeEnd('kebabToCamel性能测试');

const camelStr = 'getElementByIdFromDocument';
console.time('camelToKebab性能测试');
for (let i = 0; i < iterations; i++) {
    camelToKebab(camelStr);
}
console.timeEnd('camelToKebab性能测试');