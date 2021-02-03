
/**
 * 
 * @param {string} str 
 */
function convert(str) {

    return str.replace(/-\w/g, function (s) {
        console.log('replace s:', s);
        return s.slice(1).toUpperCase()
    })
}

function transform(str) {

    return str.replace(/-(\w)/g, (match, p1) => {
        console.log('match $1:', match, p1)
        return p1.toUpperCase()
    })
}

var str = "get-element-by-id"

console.log(convert(str));

console.log(transform(str));