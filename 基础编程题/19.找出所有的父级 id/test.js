
function findIds(list, id) {

    function dfs(list, id) {

        for (let item of list) {
            if (item.id === id) {
                return [item.id];
            } else if (item.children && item.children.length > 0) {
                let ids = dfs(item.children, id);

                if (ids) {
                    return [item.id, ...ids];
                }
            }
        }

    }

    return dfs(list, id);
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

const value = '111';

console.log('parent ids:', findIds(data, value));