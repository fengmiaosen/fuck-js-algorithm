const { Queue } = require('./queue.js');

class Graph {

    constructor() {
        this.vertexes = [];
        this.edges = new Map();
    }

    // 添加对应顶点
    addVertex(v) {
        this.vertexes.push(v);
        this.edges.set(v, []);
    }

    addEdge(v1, v2) {
        this.edges.get(v1).push(v2);
        this.edges.get(v2).push(v1);
    }

    toString() {

        let str = '';

        for (let i = 0; i < this.vertexes.length; i++) {
            const vertex = this.vertexes[i];
            str = `${str}${vertex} ->`;

            //当前顶点的邻接表（所有相邻顶点列表）
            const vEdges = this.edges.get(vertex);
            for (let j = 0; j < vEdges.length; j++) {
                str = `${str}${vEdges[j]} `;
            }

            str = `${str}\n`
        }

        return str;
    }

    //图的遍历
    // 初始化状态颜色
    // 白色 —— 顶点还未被访问
    // 灰色 —— 顶点被访问过，但未被探索过
    // 黑色 —— 顶点被访问过且被完全探索过
    initColor() {
        const color = [];

        this.vertexes.forEach(v => {
            color[v] = 'white'
        });

        return color;
    }

    // 广度优先搜索算法(BFS)  基于队列完成
    bfs(intV, callback) {
        const colors = this.initColor();

        const queue = new Queue();
        queue.enqueue(intV);

        while (!queue.isEmpty()) {
            // 从队列取出一个顶点
            const v = queue.dequeue();

            // 获取相邻顶点的邻接表
            const vEdges = this.edges.get(v);

            colors[v] = 'gray';

            // 遍历所有的顶点，并且加入到队列中
            vEdges.forEach(v => {
                if (colors[v] === 'white') {
                    colors[v] = 'gray';
                    queue.enqueue(v);
                }
            })

            // 访问顶点
            callback(v);

            // 将顶点设置为黑色
            colors[v] = 'black';
        }
    }

    // 深度优先搜索算法（DFS）
    dfs(intV, callback) {
        const colors = this.initColor();

        this.dfsVisit(intV, colors, callback);
    }

    /**
     * 递归调用
     * 深度优先遍历（DFS)
     * @param {*} v 
     * @param {*} colors 
     * @param {*} callback 
     */
    dfsVisit(v, colors, callback) {
        // 将颜色设置为灰色
        colors[v] = 'gray'

        callback(v);

        // 访问v的邻接点
        const vList = this.edges.get(v);

        vList.forEach(v => {
            if(colors[v] === 'white'){
                this.dfsVisit(v, colors, callback);
            }
        });

        // 将v设置为黑色
        colors[v] = 'black';

    }

}

const graph = new Graph();

const vertexList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

vertexList.forEach(v => {
    graph.addVertex(v);
});

graph.addEdge('A', 'B')
graph.addEdge('A', 'C')
graph.addEdge('A', 'D');
graph.addEdge('C', 'D')
graph.addEdge('C', 'G')
graph.addEdge('D', 'G')
graph.addEdge('D', 'H')
graph.addEdge('B', 'E')
graph.addEdge('B', 'F')

console.log('graph str:', graph.toString())

console.log('graph bfs:')

graph.bfs('A', (v) => {
    console.log(v);
})

console.log('graph dfs:')

graph.dfs('A', v => {
    console.log(v)
});