

function cloneDeep(obj, map = new WeakMap()) {
    if(!obj || typeof obj !== 'object'){
        return obj;
    }

    if(map.has(obj)){
        return map.get(obj);
    }

    const target = Array.isArray(obj)?[]:{};

    map.set(obj, target);

    //开始遍历复制
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            if(typeof obj[key] === 'object'){
                target[key]=cloneDeep(obj[key], map);
            }else{
                target[key]=obj[key];
            }
        }
    }

    return target;
}


let obj = {
    a: {
        a_bfff_x: [
            1,
            {
                c: 2
            }
        ]
    },
    x_booo: 1,
    y: [
        {
            a_yppp: 22,
            b: null,
            c: {
                d: [12, 34, 67]
            }
        }
    ]
};

console.log('clone obj:', JSON.stringify(cloneDeep(obj)));
