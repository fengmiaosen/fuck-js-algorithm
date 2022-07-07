
/**
 * 
 * @param {object} obj 
 * @param {Function} R 
 */
function instance_of(obj, R){
    let proto = Object.getPrototypeOf(obj)

    while(proto){
        if(proto === R.prototype){
            return true
        }

        //相当于 L = L.__proto__
        proto = Object.getPrototypeOf(proto)
    }

    return false
}

function C() { }
function D() { }

var o = new C();

var myDate = new Date();

var myNonObj  = Object.create(null);


console.log(instance_of(o, Object));

console.log(instance_of(myDate, Object));

console.log(instance_of(myNonObj, Object));