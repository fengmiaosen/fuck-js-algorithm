
function findIds(list, id) {

    return dfs(list, id);
}

function dfs(list, id) {

    let stack = [...list];

    while (stack.length) {

        const current = stack.pop();

        if (current.id === id) {
            return [current.id];
        } else if (current.children && current.children.length) {

            const rs = dfs(current.children, id);

            if (rs) {
                return [current.id, ...rs];
            }
        }

    }

}


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

console.log('find ids:', findIds(data, '112'))