//#Source https://bit.ly/2neWfJ2
// https://www.npmjs.com/package/snake-case
// https://github.com/lodash/lodash/blob/master/snakeCase.js

/**
 * 
 * @param {string} str 
 * @returns 
 */
const toSnakeCase = (str) => {
    return str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase())
        .join('_');
}


console.log(toSnakeCase('camelCase'));
console.log(toSnakeCase('some text'));
console.log(toSnakeCase('some-mixed_string With spaces_underscores-and-hyphens'));
console.log(toSnakeCase('AllThe-small Things'));
console.log(toSnakeCase('IAmListeningToFMWhileLoadingDifferentURLOnMyBrowserAndAlsoEditingSomeXMLAndHTML'));
