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

function cloneDeep(obj, map = new Map()){

    let queue = []
    let map = new WeakMap();

    let target = Array.isArray(obj) ? [] : {}
    map.set(obj, target)
    queue.push([obj, target])

    while(queue.length){
        const [obj, target] = queue.shift();

        for(let key in obj){
            
        }
    }
}

console.log('clone obj:', JSON.stringify(cloneDeep(obj)))