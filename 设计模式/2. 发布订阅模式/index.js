
const PubSub = (() => {
    const topics = {};  //保存订阅主题
    const subscribe = (type, fn) => {   //订阅某类型主题
        if (!topics[type]) {
            topics[type] = [];
        }
        topics[type].push(fn);
    };
    const publish = (type, ...args) => {    //发布某类型主题
        if (!topics[type]) {
            return;
        }
        for (let fn of topics[type]) {      //通知相关主题订阅者
            fn(args);
        }
    };
    return { subscribe, publish };
})();

let subA = { type: 'event1' },
    subB = { type: 'event2' },
    subC = { type: 'event1' };
PubSub.subscribe(subA.type, () => console.log(`update eventType: ${subA.type} subA`));   //订阅者A订阅topic1
PubSub.subscribe(subB.type, () => console.log(`update eventType: ${subB.type} subB`));   //订阅者B订阅topic2
PubSub.subscribe(subC.type, () => console.log(`update eventType: ${subC.type} subC`));   //订阅者C订阅topic1
PubSub.publish(subA.type);  //发布topic通知，通知订阅者A、C

