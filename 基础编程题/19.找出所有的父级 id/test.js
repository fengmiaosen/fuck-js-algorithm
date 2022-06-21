const data = [{
    id: '1',
    name: 'test1',
    children: [
        {
            id: '11',
            name: 'test11',
            children: [
                {
                    id: '111',
                    name: 'test111'
                },
                {
                    id: '112',
                    name: 'test112'
                }
            ]

        },
        {
            id: '12',
            name: 'test12',
            children: [
                {
                    id: '121',
                    name: 'test121'
                },
                {
                    id: '122',
                    name: 'test122'
                }
            ]
        }
    ]
}];

function findPath(data, id) {

    for(let item of data){
        if(item.id === id){
            return [id]
        }else if(item.children && item.children.length){
            const res = findPath(item.children, id)
            if(res){
                return [item.id, ...res]
            }
        }
    }
}

console.log(findPath(data, '122'))