// 方法二
// 回溯法
// 解决一个回溯问题，实际上就是一个决策树的遍历过程。你只需要思考 3 个问题：
// 1、路径：也就是已经做出的选择。
// 2、选择列表：也就是你当前可以做的选择。
// 3、结束条件：也就是到达决策树底层，无法再做选择的条件。

// 在递归之前做出选择
// 在递归之后撤销刚才的选择
// 就能正确得到每个节点的选择列表和路径

/**
 * 输入字符串，返回其字符的全排列
 * 参考 https://labuladong.gitbook.io/algo/di-ling-zhang-bi-du-xi-lie/hui-su-suan-fa-xiang-jie-xiu-ding-ban
 * @param {string} str 
 */
function permute(str) {

    let res = [];

    //记录已遍历过的路径（字符）
    let track = [];

    dfs(str, track, res);

    return res;
}

/**
 * 需要维护走过的「路径」和当前可以做的「选择列表」，当触发「结束条件」时，将「路径」记入结果集
 * 路径：记录在 track 中
 * 选择列表：str 中不存在于 track 的那些元素
 * 结束条件：str 中的元素全都在 track 中出现
 * @param {string} str
 * @param {string[]} track  
 * @param {string[]} res 
 */
function dfs(str, track, res) {
    // 到达决策树（回溯树）的叶子节点，触发结束条件
    if (track.length === str.length) {
        // 相当于把路径数组拷贝到结果数组中
        res.push(track.join(''));
        return;
    }

    for (let i = 0; i < str.length; i++) {

        // 排除不合法的选择（剪枝）
        // 相当于隐性的选择列表
        if (track.includes(str[i])) {
            continue;
        }

        //做选择
        track.push(str[i]);

        //递归，进入下一层决策树
        dfs(str, track, res);

        //撤销选择
        track.pop();

    }
}

console.log('字符串全排列:', permute('abcd'));
