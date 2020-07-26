
/**
 * 
 * @param {string} str 
 */
function convert(str){

    return str.replace(/-\w/g, function(s){
        console.log('replace s:', s);
        return s.slice(1).toUpperCase()
    })
}

var str = "get-element-by-id"

console.log(convert(str));