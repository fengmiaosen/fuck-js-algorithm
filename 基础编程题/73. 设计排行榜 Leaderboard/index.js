/**
 * 力扣 1244. 设计排行榜（Design A Leaderboard）
 * https://leetcode-cn.com/problems/design-a-leaderboard/
 *
 * 核心思路：
 * 用 Map 保存 playerId -> 当前总分，addScore / reset 都是 O(1)；
 * top(K) 时把所有分数拿出来排序，取前 K 大求和。
 *
 * 复杂度：addScore、reset 为 O(1)；
 *        top(K) 为 O(n log n)，n 为当前榜单人数。
 * 题目最多 1000 次调用，直接排序完全够用。
 */
class Leaderboard {
    constructor() {
        // playerId -> score，Map 的增删改查均为 O(1)
        this.scores = new Map();
    }

    /**
     * @param {number} playerId
     * @param {number} score
     * @return {void}
     */
    addScore(playerId, score) {
        // 不在榜单上时 get 返回 undefined，(undefined || 0) + score 恰好等于 score
        this.scores.set(playerId, (this.scores.get(playerId) || 0) + score);
    }

    /**
     * @param {number} K
     * @return {number}
     */
    top(K) {
        let sum = 0;

        // 降序排列，前 K 个就是分数最高的 K 名参赛者
        const list = [...this.scores.values()].sort((a, b) => b - a);

        for (let i = 0; i < K; i++) {
            sum += list[i];
        }

        return sum;
    }

    /**
     * @param {number} playerId
     * @return {void}
     */
    reset(playerId) {
        // 题目保证调用前该参赛者在榜单上，所以直接删除即可
        this.scores.delete(playerId);
    }
}

/**
 * 进阶：如果 K 远小于人数 n，可以把 top(K) 优化到 O(n log K)
 * 维护一个「大小为 K 的小顶堆」，堆顶就是第 K 大的分数：
 * 遍历分数入堆，堆大小超过 K 就弹出堆顶（淘汰当前最小的那个），
 * 遍历结束后堆内剩下的 K 个数就是前 K 大的分数，求和即可。
 */
class MinHeap {
    constructor() {
        this.heap = [];
    }

    get size() {
        return this.heap.length;
    }

    peek() {
        return this.heap[0];
    }

    push(val) {
        const heap = this.heap;
        heap.push(val);

        // 上浮：与父节点比较，比父节点小就交换
        let i = heap.length - 1;
        while (i > 0) {
            const parent = (i - 1) >> 1;
            if (heap[parent] <= heap[i]) break;
            [heap[parent], heap[i]] = [heap[i], heap[parent]];
            i = parent;
        }
    }

    pop() {
        const heap = this.heap;
        const top = heap[0];
        const last = heap.pop();

        if (heap.length) {
            heap[0] = last;

            // 下沉：与左右子节点中较小的一个交换
            let i = 0;
            while (true) {
                const left = i * 2 + 1;
                const right = left + 1;
                let min = i;

                if (left < heap.length && heap[left] < heap[min]) min = left;
                if (right < heap.length && heap[right] < heap[min]) min = right;
                if (min === i) break;

                [heap[i], heap[min]] = [heap[min], heap[i]];
                i = min;
            }
        }

        return top;
    }
}

class LeaderboardWithHeap {
    constructor() {
        this.scores = new Map();
    }

    addScore(playerId, score) {
        this.scores.set(playerId, (this.scores.get(playerId) || 0) + score);
    }

    top(K) {
        const heap = new MinHeap();

        for (const score of this.scores.values()) {
            heap.push(score);

            // 堆里只保留最大的 K 个分数
            if (heap.size > K) heap.pop();
        }

        let sum = 0;
        while (heap.size) {
            sum += heap.pop();
        }

        return sum;
    }

    reset(playerId) {
        this.scores.delete(playerId);
    }
}

// ---------------- 自测：跑一遍题目示例 ----------------
function run(LeaderboardClass, operations, args) {
    const output = [];
    let instance = null;

    operations.forEach((method, i) => {
        if (method === 'Leaderboard') {
            instance = new LeaderboardClass();
            output.push(null);
            return;
        }
        output.push(instance[method](...args[i]));
    });

    return output;
}

const operations = [
    'Leaderboard',
    'addScore', 'addScore', 'addScore', 'addScore', 'addScore',
    'top',
    'reset', 'reset',
    'addScore',
    'top'
];
const args = [
    [], [1, 73], [2, 56], [3, 39], [4, 51], [5, 4],
    [1],
    [1], [2],
    [2, 51],
    [3]
];
// 期望输出：[null,null,null,null,null,null,73,null,null,null,141]
const expected = [null, null, null, null, null, null, 73, null, null, null, 141];

[Leaderboard, LeaderboardWithHeap].forEach((Cls) => {
    const result = run(Cls, operations, args);
    console.log(`${Cls.name}:`, JSON.stringify(result));
    console.log('是否与期望一致:', JSON.stringify(result) === JSON.stringify(expected));
});
