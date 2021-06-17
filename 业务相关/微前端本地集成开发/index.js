
module.exports = {
    host: 'local.kuaishou.com', //可选配置项，
    port: 3100, // 可选配置项，⼦应⽤启动端⼝号
    project: {
        key: 'subapp1', //⼦应⽤唯⼀key值，与package.json中name保持⼀致
        name: '子项目',
        entry: 'http://local.kuaishou.com:3100/', //⼦应⽤⾸⻚html url地址
    }
}

module.exports = {
    data: [
        {
            key: 'subapp1', // ⼦应⽤的key，子项目之间必须确保唯⼀
            name: '子项目',
            url: '',
            entry: 'http://local.kuaishou.com:3100/',
        },
    ],
    code: 200,
    message: 'success'
}