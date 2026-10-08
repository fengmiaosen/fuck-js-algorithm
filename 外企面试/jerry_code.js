
class RangeList {
    constructor() {
        this.list = [];
    }

    reRank(list, i) {
        const [min, max] = list[i];
        let res = [...list];

        let start = i;
        let end = i;
        let resMin = min;
        let resMax = max;

        if (i !== 0) {
            const [preMin, preMax] = list[i - 1];
            if (min <= preMax) {
                start = i - 1;

                resMin = preMin;
            }
        }

        let index = i + 1;
        while (index < list.length) {
            const [nextMin, nextMax] = list[index];

            if (max >= nextMin && max <= nextMax) {
                end = index;
                resMax = nextMax;
                break;
            }
            else if (max > nextMax) {
                end = index + 1;
            }
            index++;
        }
        res.splice(start, end - start + 1, [resMin, resMax]);
        return res;
    }

    add(range) {
        let list = [...this.list];
        let [curMin, curMax] = range;
        const len = list.length;

        if (len === 0) {
            this.list.push(range);
            return;
        }

        for (var i = 0; i < len; i++) {
            const [min] = list[i];
            if (curMin < min) {

                list.splice(i, 0, range);

                list = this.reRank(list, i);
                break;
            }
        }

        if (list.length === len && list[len - 1][1] < curMin) {
            list.push(range);
        } else if (list.length === len && list[len - 1][1] >= curMin) {
            list.splice(len - 1, 1, [list[len - 1][0], Math.max(list[len - 1][1], curMax)]);
        }
        this.list = list;
    }
    
    remove(range) {
        let [curMin, curMax] = range;
        let list = [...this.list];

        for (let i = 0, l = list.length; i < l; i++) {
            const [min, max] = this.list[i];

            if (!(curMin > max || curMax < min)) {
                let arr = [];

                if (curMin <= min && curMax <= max) {
                    if (curMax + 1 !== max) {
                        arr.push([curMax + 1, max])
                    }
                } else if (curMin > min && curMax < max) {
                    arr.push([min, curMin], [curMax, max]);
                } else {
                    if (min !== curMin) {
                        arr.push([min, curMin])
                    }
                }
                list.splice(i, 1, ...arr);
            }
        }
        this.list = list;
    }
    print() {
        const list = this.list;
        let res = '';
        for (let i = 0; i < list.length; i++) {
            res += `[${list[i].toString()}]`
        }
        console.log(res);
        return res;
    }
}

// Example run
const rl = new RangeList();
rl.add([1, 5]);
rl.print();
// Should display: [1, 5)
rl.add([10, 20]);
rl.print();
// Should display: [1, 5) [10, 20)
rl.add([20, 20]);
rl.print();
// Should display: [1, 5) [10, 20)
rl.add([20, 21]);
rl.print();
// Should display: [1, 5) [10, 21)
rl.add([2, 4]);
rl.print();
// Should display: [1, 5) [10, 21)
rl.add([3, 8]);
rl.print();
// Should display: [1, 8) [10, 21)

rl.remove([10, 10]);
rl.print();
// Should display: [1, 8) [10, 21)
rl.remove([10, 11]);
rl.print();
// Should display: [1, 8) [11, 21)
rl.remove([15, 17]);
rl.print();
// Should display: [1, 8) [11, 15) [17, 21)
rl.remove([3, 19]);
rl.print();
// Should display: [1, 3) [19, 21)