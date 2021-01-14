
/**
 * 
 * @param {object} left 
 * @param {Object} right 
 */
function instance_of(left, right) {

    left = Object.getPrototypeOf(left)
    right = right.prototype

    while(left){

        if(left === right){
            return true
        }

        left = Object.getPrototypeOf(left)
    }

    return false
}

function FN(){

}

function FB(){

}

let obj1 = new FN()

let obj2 = new FB()

let obj3 = new Date()

let obj4 = Object.create(null)

console.log(instance_of(obj1, Object))
console.log(instance_of(obj2, FN))
console.log(instance_of(obj3, Object))
console.log(instance_of(obj4, Object))