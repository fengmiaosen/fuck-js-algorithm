var obj = {
    name: 'this is A'
}
var objB = {
    name: 'this is B'
}
obj.child = objB
objB.parent = obj;

/**
 * 方法一：利用JSON.stringify特性
 * @param {*} obj 
 */
function hasCycle(obj) {

    try {
        JSON.stringify(obj);
        return false;
    } catch (err) {
        // console.log('obj has cycle!!!', err);
        return true;
    }
}

/**
 * 方法二：使用 WeakMap
 * @param {*} obj 
 */
function hasCycle2(obj) {
    const map = new WeakMap();

    function isCycle(obj){
        if (!obj) {
            return false;
        }
    
        if (map.has(obj)) {
            return true;
        } else {
            map.set(obj, obj);
        }
    
        for (let key in obj) {
            if (typeof obj[key] === 'object' && obj[key]) {
                return isCycle(obj[key], map);
            }
        }
    
        return false;
    }

    return isCycle(obj)
}

const isCycle = hasCycle(obj);

console.log('has cycle1:', isCycle);

console.log('has cycle2:', hasCycle2(obj));